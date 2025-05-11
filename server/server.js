const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Applicant = require("./models/Applicant");
const jwt = require("jsonwebtoken");
const XLSX = require("xlsx");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Photo = require("./models/Photo");

dotenv.config();

const app = express();

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Middleware
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sailing-camps", {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4
    })
    .then(() => {
        console.log("Connected to MongoDB");
        // Log the connection details
        console.log("MongoDB URI:", process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sailing-camps");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit if we can't connect to the database
    });

// Admin Model
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = user;
        next();
    });
};

// Admin login route
app.post("/api/admin/login", async (req, res) => {
    try {
        console.log("Login attempt received:", req.body);
        const { username, password } = req.body;

        // In a real application, you should hash passwords and use proper authentication
        const admin = await Admin.findOne({ username, password });
        console.log("Admin lookup result:", admin ? "Found" : "Not found");

        if (!admin) {
            console.log("Login failed: Invalid credentials");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
        console.log("Login successful, token generated");

        res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Protected route to get all applicants
app.get("/api/applicants", authenticateToken, async (req, res) => {
    try {
        const applicants = await Applicant.find().sort({ registrationDate: -1 });
        res.json(applicants);
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).json({ message: "Error fetching applicants" });
    }
});

// API Routes
app.post("/api/applicants", async (req, res) => {
    try {
        console.log("Received application data:", req.body);

        // Validate required fields
        const requiredFields = ["name", "email", "age", "experience", "campType", "startDate"];
        const missingFields = requiredFields.filter((field) => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
        }

        const applicant = new Applicant(req.body);
        const savedApplicant = await applicant.save();
        console.log("Successfully saved applicant:", savedApplicant);
        res.status(201).json(savedApplicant);
    } catch (error) {
        console.error("Error saving applicant:", error);
        res.status(500).json({ message: "Error saving application" });
    }
});

// Test endpoint to verify database connection
app.get("/api/test", async (req, res) => {
    try {
        // Try to create a test document
        const testApplicant = new Applicant({
            name: "Test User",
            email: "test@example.com",
            age: 25,
            experience: "beginner",
            campType: "residential",
            startDate: new Date(),
            additionalInfo: "Test connection",
        });

        await testApplicant.save();

        // If successful, delete the test document
        await Applicant.deleteOne({ email: "test@example.com" });

        res.json({
            message: "Database connection successful!",
            status: "connected",
        });
    } catch (error) {
        res.status(500).json({
            message: "Database connection failed",
            error: error.message,
        });
    }
});

// Excel generation endpoint
app.get("/api/applicants/excel", authenticateToken, async (req, res) => {
    try {
        const applicants = await Applicant.find().sort({ registrationDate: -1 });

        // Transform data for Excel
        const excelData = applicants.map((applicant) => ({
            Name: applicant.name,
            Email: applicant.email,
            Age: applicant.age,
            Experience: applicant.experience,
            "Camp Type": applicant.campType,
            "Start Date": new Date(applicant.startDate).toLocaleDateString(),
            "Registration Date": new Date(applicant.registrationDate).toLocaleDateString(),
            "Additional Info": applicant.additionalInfo || "",
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Applicants");

        // Generate buffer
        const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

        // Set headers for file download
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=applicants.xlsx");

        // Send the file
        res.send(excelBuffer);
    } catch (error) {
        console.error("Error generating Excel file:", error);
        res.status(500).json({ message: "Error generating Excel file" });
    }
});

// Photo upload endpoint
app.post("/api/upload", authenticateToken, upload.single("photo"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Create a new photo document in the database
        const photo = new Photo({
            filename: req.file.filename,
            path: req.file.path,
            uploadedBy: req.user.username,
            uploadDate: new Date(),
        });

        await photo.save();

        res.json({
            message: "Photo uploaded successfully",
            photo: {
                id: photo._id,
                filename: photo.filename,
                path: photo.path,
            },
        });
    } catch (error) {
        console.error("Error uploading photo:", error);
        res.status(500).json({ message: "Error uploading photo" });
    }
});

// Get all photos endpoint
app.get("/api/photos", async (req, res) => {
    try {
        const photos = await Photo.find().sort({ uploadDate: -1 });
        res.json(photos);
    } catch (error) {
        console.error("Error fetching photos:", error);
        res.status(500).json({ message: "Error fetching photos" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
