const express = require("express");
const router = express.Router();
const Applicant = require("../models/Applicant");
const { authenticateToken } = require("../middleware/auth");

// Approve/Reject applicant
router.put("/:id/approve", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const adminId = req.user.id;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const applicant = await Applicant.findById(id);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }

        applicant.status = status;
        applicant.approvedBy = adminId;
        applicant.approvedAt = new Date();

        await applicant.save();

        res.json({ message: "Applicant status updated successfully", applicant });
    } catch (error) {
        console.error("Error updating applicant status:", error);
        res.status(500).json({ message: "Error updating applicant status" });
    }
});

module.exports = router;
