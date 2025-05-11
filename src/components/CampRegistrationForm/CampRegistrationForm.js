import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config";
import "./CampRegistrationForm.css";

function CampRegistrationForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        experience: "beginner",
        campType: "residential",
        startDate: "",
        additionalInfo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Format the data for the database
            const dataToSend = {
                ...formData,
                age: parseInt(formData.age), // Convert age to number
                startDate: new Date(formData.startDate).toISOString(), // Format date properly
            };

            console.log("Sending data to server:", dataToSend);

            // Save to database
            const response = await fetch("http://localhost:5001/api/applicants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(dataToSend),
                mode: "cors",
            });

            console.log("Server response status:", response.status);
            const responseData = await response.json();
            console.log("Server response data:", responseData);

            if (!response.ok) {
                throw new Error(responseData.message || "Failed to submit application");
            }

            alert("Thank you for registering! We will contact you with more details.");

            // Reset form
            setFormData({
                name: "",
                email: "",
                age: "",
                experience: "beginner",
                campType: "residential",
                startDate: "",
                additionalInfo: "",
            });
        } catch (error) {
            console.error("Error submitting application:", error);
            alert("There was an error submitting your application: " + error.message);
        }
    };

    return (
        <div className="signup-section">
            <h2>Sign Up for a Camp</h2>
            <form onSubmit={handleSubmit} className="camp-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your email" />
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required min="12" max="80" placeholder="Your age" />
                </div>

                <div className="form-group">
                    <label htmlFor="experience">Sailing Experience:</label>
                    <select id="experience" name="experience" value={formData.experience} onChange={handleChange} required>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="campType">Camp Type:</label>
                    <select id="campType" name="campType" value={formData.campType} onChange={handleChange} required>
                        <option value="residential">Residential Camp (Overnight Stay)</option>
                        <option value="walk-in">Walk-in Camp (Day Program)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">Preferred Start Date:</label>
                    <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="additionalInfo">Additional Information:</label>
                    <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        placeholder="Any special requirements or questions"
                        rows="4"
                    />
                </div>

                <button type="submit" className="submit-button">
                    Register for Camp
                </button>
            </form>
        </div>
    );
}

export default CampRegistrationForm;
