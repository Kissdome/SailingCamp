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
            <h2 className="add-applicant-title">Add New Applicant</h2>
            {error && <div className="add-applicant-error">{error}</div>}
            {success && <div className="add-applicant-success">Applicant added successfully!</div>}
            <form className="add-applicant-form" onSubmit={handleSubmit}>
                <div className="add-applicant-grid">
                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="name">
                            Name *
                        </label>
                        <input className="add-applicant-input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="email">
                            Email *
                        </label>
                        <input className="add-applicant-input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="age">
                            Age *
                        </label>
                        <input className="add-applicant-input" type="number" id="age" name="age" value={formData.age} onChange={handleChange} min="1" max="100" required />
                    </div>

                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="experience">
                            Experience Level *
                        </label>
                        <select className="add-applicant-select" id="experience" name="experience" value={formData.experience} onChange={handleChange} required>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="campType">
                            Camp Type *
                        </label>
                        <select className="add-applicant-select" id="campType" name="campType" value={formData.campType} onChange={handleChange} required>
                            <option value="residential">Residential</option>
                            <option value="walk-in">Walk-in</option>
                        </select>
                    </div>

                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="camp">
                            Camp *
                        </label>
                        <select className="add-applicant-select" id="camp" name="camp" value={formData.camp} onChange={handleChange} required>
                            <option value="">Select a camp</option>
                            {camps.map((camp) => (
                                <option key={camp._id} value={camp._id}>
                                    {camp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="startDate">
                            Start Date *
                        </label>
                        <input className="add-applicant-input" type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />
                    </div>

                    <div className="add-applicant-form-group full-width">
                        <label className="add-applicant-label" htmlFor="additionalInfo">
                            Additional Information
                        </label>
                        <textarea className="add-applicant-textarea" id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows="4" />
                    </div>
                </div>

                <div className="add-applicant-actions">
                    <button type="submit" className="add-applicant-submit" disabled={loading}>
                        {loading ? "Adding..." : "Add Applicant"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddApplicant;
