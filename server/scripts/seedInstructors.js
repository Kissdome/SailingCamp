const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Instructor = require("../models/Instructor");

dotenv.config();

const instructors = [
    {
        name: "Captain Sarah Johnson",
        role: "Head Instructor",
        experience: "15 years",
        specialties: ["Racing", "Navigation", "Safety Training"],
        bio: "Sarah is a certified sailing instructor with extensive experience in competitive racing and navigation. She has trained numerous national champions and specializes in advanced sailing techniques.",
        image: "/images/instructors/sarah.jpg",
        isActive: true,
    },
    {
        name: "Mike Thompson",
        role: "Senior Instructor",
        experience: "12 years",
        specialties: ["Beginner Training", "Yacht Master", "Navigation"],
        bio: "Mike specializes in teaching beginners and has developed our popular 'First Sail' program. His patient teaching style makes him a favorite among new sailors.",
        image: "/images/instructors/mike.jpg",
        isActive: true,
    },
    {
        name: "Emma Rodriguez",
        role: "Instructor",
        experience: "8 years",
        specialties: ["Youth Programs", "Team Building", "Safety Training"],
        bio: "Emma leads our youth programs and specializes in making sailing fun and accessible for young learners. She has a background in education and competitive sailing.",
        image: "/images/instructors/emma.jpg",
        isActive: true,
    },
];

const seedInstructors = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sailing-camps", {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
        });
        console.log("Connected to MongoDB");

        // Clear existing instructors
        await Instructor.deleteMany({});
        console.log("Cleared existing instructors");

        // Insert new instructors
        const result = await Instructor.insertMany(instructors);
        console.log("Successfully added instructors:", result.length);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error seeding instructors:", error);
        process.exit(1);
    }
};

// Run the seeding function
seedInstructors();
