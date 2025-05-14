const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Applicant = require("./models/Applicant");
const Camp = require("./models/Camp");
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

// Public GET /api/camps route - must be before any other routes
app.get("/api/camps", async (req, res) => {
    console.log("GET /api/camps request received");
    try {
        const camps = await Camp.find().sort({ createdAt: -1 });
        console.log("Camps found:", camps.length);
        res.json(camps);
    } catch (error) {
        console.error("Error fetching camps:", error);
        res.status(500).json({ message: "Error fetching camps" });
    }
});

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

// Public routes - defined before any authentication middleware
app.get("/api/photos", async (req, res) => {
    try {
        const photos = await Photo.find().sort({ uploadDate: -1 });
        res.json(photos);
    } catch (error) {
        console.error("Error fetching photos:", error);
        res.status(500).json({ message: "Error fetching photos" });
    }
});

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

// Protected routes
app.post("/api/camps", authenticateToken, async (req, res) => {
    try {
        const camp = new Camp(req.body);
        const savedCamp = await camp.save();
        res.status(201).json(savedCamp);
    } catch (error) {
        console.error("Error creating camp:", error);
        res.status(500).json({ message: "Error creating camp" });
    }
});

app.get("/api/camps/:id", authenticateToken, async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({ message: "Camp not found" });
        }
        res.json(camp);
    } catch (error) {
        console.error("Error fetching camp:", error);
        res.status(500).json({ message: "Error fetching camp" });
    }
});

app.put("/api/camps/:id", authenticateToken, async (req, res) => {
    try {
        const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!camp) {
            return res.status(404).json({ message: "Camp not found" });
        }
        res.json(camp);
    } catch (error) {
        console.error("Error updating camp:", error);
        res.status(500).json({ message: "Error updating camp" });
    }
});

app.delete("/api/camps/:id", authenticateToken, async (req, res) => {
    try {
        const camp = await Camp.findByIdAndDelete(req.params.id);
        if (!camp) {
            return res.status(404).json({ message: "Camp not found" });
        }
        res.json({ message: "Camp deleted successfully" });
    } catch (error) {
        console.error("Error deleting camp:", error);
        res.status(500).json({ message: "Error deleting camp" });
    }
});

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

// Create a new applicant
app.post("/api/applicants", async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            console.error("MongoDB not connected. Current state:", mongoose.connection.readyState);
            return res.status(500).json({
                message: "Database connection error. Please try again.",
                details: "MongoDB not connected",
            });
        }

        console.log("Received registration request:", req.body);
        const { name, email, age, experience, campType, startDate, additionalInfo, camp } = req.body;

        // Validate required fields
        if (!name || !email || !age || !experience || !campType || !startDate || !camp) {
            const missingFields = [];
            if (!name) missingFields.push("name");
            if (!email) missingFields.push("email");
            if (!age) missingFields.push("age");
            if (!experience) missingFields.push("experience");
            if (!campType) missingFields.push("campType");
            if (!startDate) missingFields.push("startDate");
            if (!camp) missingFields.push("camp");

            console.log("Missing required fields:", missingFields);
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Invalid email format:", email);
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Validate age is a number
        const ageNum = parseInt(age);
        if (isNaN(ageNum)) {
            console.log("Invalid age format:", age);
            return res.status(400).json({ message: "Age must be a valid number" });
        }

        // Check if the camp exists and has available capacity
        let selectedCamp;
        try {
            selectedCamp = await Camp.findById(camp);
            if (!selectedCamp) {
                console.log("Camp not found:", camp);
                return res.status(404).json({ message: "Selected camp not found" });
            }
            console.log("Found camp:", selectedCamp);
        } catch (campError) {
            console.error("Error finding camp:", campError);
            return res.status(500).json({
                message: "Error finding camp. Please try again.",
                details: campError.message,
            });
        }

        // Validate age against camp's age range
        try {
            const [minAge, maxAge] = selectedCamp.ageRange.split("-").map((num) => parseInt(num.trim()));
            console.log("Age validation:", { age: ageNum, minAge, maxAge, ageRange: selectedCamp.ageRange });
            if (ageNum < minAge || ageNum > maxAge) {
                console.log("Age out of range:", { age: ageNum, minAge, maxAge });
                return res.status(400).json({
                    message: `Age must be between ${minAge} and ${maxAge} years for this camp`,
                });
            }
        } catch (ageRangeError) {
            console.error("Error parsing age range:", ageRangeError);
            return res.status(500).json({
                message: "Error validating age range. Please try again.",
                details: ageRangeError.message,
            });
        }

        // Check if email is already registered
        try {
            const existingApplicant = await Applicant.findOne({ email });
            if (existingApplicant) {
                console.log("Email already registered:", email);
                return res.status(400).json({ message: "This email is already registered" });
            }
        } catch (emailCheckError) {
            console.error("Error checking email:", emailCheckError);
            return res.status(500).json({
                message: "Error checking email. Please try again.",
                details: emailCheckError.message,
            });
        }

        // Get current number of applicants for this camp
        try {
            const currentApplicants = await Applicant.countDocuments({ camp: camp });
            console.log("Current applicants count:", { camp, currentApplicants, maxCapacity: selectedCamp.maxCapacity });

            // Check if camp is at capacity
            if (currentApplicants >= selectedCamp.maxCapacity) {
                console.log("Camp at capacity:", { camp, currentApplicants, maxCapacity: selectedCamp.maxCapacity });
                return res.status(400).json({
                    message: "Sorry, this camp has reached its maximum capacity",
                });
            }
        } catch (capacityError) {
            console.error("Error checking camp capacity:", capacityError);
            return res.status(500).json({
                message: "Error checking camp capacity. Please try again.",
                details: capacityError.message,
            });
        }

        // Create and save the applicant
        const applicant = new Applicant({
            name,
            email,
            age: ageNum,
            experience,
            campType,
            startDate,
            additionalInfo,
            camp,
        });

        console.log("Saving new applicant:", applicant);
        try {
            await applicant.save();
        } catch (saveError) {
            console.error("Error saving applicant:", saveError);
            if (saveError.code === 11000) {
                return res.status(400).json({ message: "This email is already registered" });
            }
            if (saveError.name === "ValidationError") {
                return res.status(400).json({
                    message: "Validation error",
                    details: Object.values(saveError.errors).map((err) => err.message),
                });
            }
            return res.status(500).json({
                message: "Error saving applicant",
                details: saveError.message,
            });
        }

        // Add the applicant to the camp's applicants array
        try {
            selectedCamp.applicants.push(applicant._id);
            await selectedCamp.save();
        } catch (campUpdateError) {
            console.error("Error updating camp:", campUpdateError);
            // If we fail to update the camp, we should delete the applicant
            await Applicant.findByIdAndDelete(applicant._id);
            return res.status(500).json({
                message: "Error updating camp",
                details: campUpdateError.message,
            });
        }

        console.log("Registration successful:", { applicantId: applicant._id });
        res.status(201).json(applicant);
    } catch (error) {
        console.error("Error creating applicant:", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
        });

        // Send a more detailed error message
        res.status(500).json({
            message: "Error creating applicant. Please try again.",
            details:
                process.env.NODE_ENV === "development"
                    ? {
                          name: error.name,
                          message: error.message,
                      }
                    : undefined,
        });
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
