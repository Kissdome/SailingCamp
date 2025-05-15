const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    experience: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advanced"],
    },
    campType: {
        type: String,
        required: true,
        enum: ["residential", "walk-in"],
    },
    startDate: {
        type: Date,
        required: true,
    },
    additionalInfo: {
        type: String,
    },
    camp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Camp",
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
    approvedAt: {
        type: Date,
    },
});

module.exports = mongoose.model("Applicant", applicantSchema);
