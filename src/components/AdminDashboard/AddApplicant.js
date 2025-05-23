/**
 * AddApplicant Component
 *
 * This component provides a form interface for manually adding new applicants to the system.
 * Features include:
 * - Form validation including age restrictions based on camp requirements
 * - Dynamic camp selection with automatic date population
 * - Real-time validation feedback
 * - Success/error handling
 * - Integration with the main applicant list
 */

import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config";
import "./AddApplicant.css";

const AddApplicant = ({ onApplicantAdded }) => {
    // Form state management
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

    // Component state management
    const [camps, setCamps] = useState([]); // Available camps list
    const [loading, setLoading] = useState(false); // Form submission state
    const [error, setError] = useState(null); // Error state
    const [success, setSuccess] = useState(false); // Success state
    const [ageError, setAgeError] = useState(""); // Age validation error
    const [selectedCampInfo, setSelectedCampInfo] = useState(null); // Selected camp details

    // Fetch available camps on component mount
    useEffect(() => {
        fetchCamps();
    }, []);

    /**
     * Fetches available camps from the API
     * Includes authentication token in the request
     */
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

    /**
     * Validates applicant age against camp age requirements
     * @param {string} age - Applicant's age
     * @param {string} campId - Selected camp ID
     * @returns {boolean} Whether the age is valid for the selected camp
     */
    const validateAge = (age, campId) => {
        const selectedCamp = camps.find((c) => c._id === campId);
        if (!selectedCamp) return true;

        const [minAge, maxAge] = selectedCamp.ageRange.split("-").map((num) => parseInt(num.trim()));
        const applicantAge = parseInt(age);

        if (applicantAge < minAge || applicantAge > maxAge) {
            setAgeError(`Age must be between ${minAge} and ${maxAge} years for this camp`);
            return false;
        }
        setAgeError("");
        return true;
    };

    /**
     * Handles form input changes
     * Includes validation and camp-specific logic
     * @param {Event} e - The change event from the input field
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validate age when it changes or when camp changes
        if (name === "age" || name === "camp") {
            if (name === "age") {
                validateAge(value, formData.camp);
            } else {
                validateAge(formData.age, value);
            }
        }

        // Update camp info and start date when camp is selected
        if (name === "camp") {
            const selectedCamp = camps.find((c) => c._id === value);
            if (selectedCamp) {
                setSelectedCampInfo(selectedCamp);
                if (selectedCamp.startDates.length > 0) {
                    setFormData((prev) => ({
                        ...prev,
                        startDate: new Date(selectedCamp.startDates[0]).toISOString().split("T")[0],
                    }));
                }
            } else {
                setSelectedCampInfo(null);
            }
        }
    };

    /**
     * Handles form submission
     * Validates data and sends to API
     * Manages success/error states
     * @param {Event} e - The form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate age before submission
        if (!validateAge(formData.age, formData.camp)) {
            return;
        }

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
            // Reset form after successful submission
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
            setAgeError("");
            setSelectedCampInfo(null);
            if (onApplicantAdded) {
                onApplicantAdded(newApplicant);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Render the applicant form
    return (
        <div className="add-applicant-container">
            <h2 className="add-applicant-title">Add New Applicant</h2>
            {error && <div className="add-applicant-error">{error}</div>}
            {success && <div className="add-applicant-success">Applicant added successfully!</div>}
            <form className="add-applicant-form" onSubmit={handleSubmit}>
                <div className="add-applicant-grid">
                    {/* Name input */}
                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="name">
                            Name *
                        </label>
                        <input className="add-applicant-input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    {/* Email input */}
                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="email">
                            Email *
                        </label>
                        <input className="add-applicant-input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    {/* Age input with validation */}
                    <div className="add-applicant-form-group">
                        <label className="add-applicant-label" htmlFor="age">
                            Age *
                        </label>
                        <input
                            className={`add-applicant-input ${ageError ? "error" : ""}`}
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="1"
                            max="100"
                            required
                        />
                        {ageError && <div className="add-applicant-error">{ageError}</div>}
                    </div>

                    {/* Experience level selection */}
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

                    {/* Camp type selection */}
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

                {selectedCampInfo && (
                    <div className="add-applicant-camp-info">
                        <h3>Camp Information</h3>
                        <div className="add-applicant-camp-details">
                            <div className="add-applicant-camp-detail">
                                <strong>Age Range:</strong> {selectedCampInfo.ageRange} years
                            </div>
                            <div className="add-applicant-camp-detail">
                                <strong>Duration:</strong> {selectedCampInfo.duration} days
                            </div>
                            <div className="add-applicant-camp-detail">
                                <strong>Price:</strong> ${selectedCampInfo.price}
                            </div>
                            <div className="add-applicant-camp-detail">
                                <strong>Experience Level:</strong> {selectedCampInfo.experience}
                            </div>
                            <div className="add-applicant-camp-detail full-width">
                                <strong>Description:</strong> {selectedCampInfo.description}
                            </div>
                            <div className="add-applicant-camp-detail full-width">
                                <strong>Available Start Dates:</strong>
                                <ul className="add-applicant-dates-list">
                                    {selectedCampInfo.startDates.map((date, index) => (
                                        <li key={index}>{new Date(date).toLocaleDateString()}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="add-applicant-actions">
                    <button type="submit" className="add-applicant-submit" disabled={loading || !!ageError}>
                        {loading ? "Adding..." : "Add Applicant"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddApplicant;
