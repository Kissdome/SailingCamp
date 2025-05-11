const mongoose = require("mongoose");
require("dotenv").config();

// Admin Model
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/sailing-camps");
        console.log("Connected to MongoDB");

        // Create admin user
        const admin = new Admin({
            username: "admin",
            password: "admin123", // In a production environment, this should be hashed
        });

        await admin.save();
        console.log("Admin user created successfully");
        console.log("Username: admin");
        console.log("Password: admin123");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();
