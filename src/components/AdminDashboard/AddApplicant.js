import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config";
import "./AddApplicant.css";

const AddApplicant = ({ onApplicantAdded }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
        experience: "beginner",
        campType: "residential",
        startDate: "",
        additionalInfo: "",
        camp: "",
    });
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchCamps();
    }, []);

    const fetchCamps = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(API_ENDPOINTS.CAMPS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch camps");
            const data = await response.json();
            setCamps(data);
        } catch (err) {
            setError("Failed to load camps. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(API_ENDPOINTS.APPLICANTS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add applicant");
            }

            const newApplicant = await response.json();
            setSuccess(true);
            setFormData({
                name: "",
                email: "",
                age: "",
                experience: "beginner",
                campType: "residential",
                startDate: "",
                additionalInfo: "",
                camp: "",
            });
            if (onApplicantAdded) {
                onApplicantAdded(newApplicant);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-applicant-container">
            <h3>Add New Applicant</h3>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Applicant added successfully!</div>}
            <form onSubmit={handleSubmit} className="add-applicant-form">
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required min="1" />
                </div>

                <div className="form-group">
                    <label htmlFor="experience">Experience Level:</label>
                    <select id="experience" name="experience" value={formData.experience} onChange={handleChange} required>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="campType">Camp Type:</label>
                    <select id="campType" name="campType" value={formData.campType} onChange={handleChange} required>
                        <option value="residential">Residential</option>
                        <option value="walk-in">Walk-in</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="camp">Camp:</label>
                    <select id="camp" name="camp" value={formData.camp} onChange={handleChange} required>
                        <option value="">Select a camp</option>
                        {camps.map((camp) => (
                            <option key={camp._id} value={camp._id}>
                                {camp.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">Start Date:</label>
                    <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="additionalInfo">Additional Info:</label>
                    <textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="3" />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Adding..." : "Add Applicant"}
                </button>
            </form>
        </div>
    );
};

export default AddApplicant;
