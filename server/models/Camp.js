const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ["residential", "walk-in"],
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDates: [
        {
            type: Date,
            required: true,
        },
    ],
    ageRange: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    maxCapacity: {
        type: Number,
        required: true,
        min: 1,
    },
    instructorCount: {
        type: Number,
        required: true,
        min: 1,
    },
    location: {
        type: String,
        required: true,
    },
    requirements: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "completed"],
        default: "active",
    },
    applicants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Applicant",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update the updatedAt timestamp before saving
campSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Camp", campSchema);
