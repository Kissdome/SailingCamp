const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    experience: {
        type: String,
        required: true,
    },
    specialties: [
        {
            type: String,
            trim: true,
        },
    ],
    bio: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
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
instructorSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Instructor = mongoose.model("Instructor", instructorSchema);

module.exports = Instructor;
