import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config";
import "./CampRegistrationForm.css";
import { useNotification } from "../../context/NotificationContext";

function CampRegistrationForm() {
    const { addNotification } = useNotification();
    const [camps, setCamps] = useState([]);
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
    const [ageError, setAgeError] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch available camps
        const fetchCamps = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.CAMPS);
                if (!response.ok) {
                    throw new Error("Failed to fetch camps");
                }
                const data = await response.json();
                setCamps(data);

                // Check if there's a selected camp in localStorage
                const selectedCamp = localStorage.getItem("selectedCamp");
                if (selectedCamp) {
                    const camp = JSON.parse(selectedCamp);
                    // Pre-fill the form with the selected camp's data
                    setFormData((prevData) => ({
                        ...prevData,
                        camp: camp._id,
                        campType: camp.type,
                        experience: camp.experience,
                        // Set the first available start date as default
                        startDate: camp.startDates[0] ? new Date(camp.startDates[0]).toISOString().split("T")[0] : "",
                    }));
                    // Clear the selected camp from localStorage
                    localStorage.removeItem("selectedCamp");
                }
            } catch (error) {
                console.error("Error fetching camps:", error);
                addNotification("Failed to load available camps. Please try again later.", "error");
            }
        };

        fetchCamps();
    }, []);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
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

        // Update start date when camp is selected
        if (name === "camp") {
            const selectedCamp = camps.find((c) => c._id === value);
            if (selectedCamp && selectedCamp.startDates.length > 0) {
                setFormData((prevState) => ({
                    ...prevState,
                    startDate: new Date(selectedCamp.startDates[0]).toISOString().split("T")[0],
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate age before submission
        if (!validateAge(formData.age, formData.camp)) {
            return;
        }

        try {
            // Format the data for the database
            const dataToSend = {
                ...formData,
                age: parseInt(formData.age), // Convert age to number
                startDate: new Date(formData.startDate).toISOString(), // Format date properly
            };

            console.log("Sending registration data:", dataToSend);

            // Save to database
            const response = await fetch(API_ENDPOINTS.APPLICANTS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error("Failed to submit application");
            }

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
            addNotification("Thank you for registering! We will contact you with more details.", "success");
        } catch (error) {
            console.error("Error submitting application:", error);
            addNotification(error.message || "There was an error submitting your application. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Find the selected camp to display its details
    const selectedCamp = camps.find((camp) => camp._id === formData.camp);

    return (
        <div className="signup-section">
            <h2>Sign Up for a Camp</h2>
            <form onSubmit={handleSubmit} className="camp-registration-form">
                <div className="form-group">
                    <label htmlFor="camp">Select Camp:</label>
                    <select id="camp" name="camp" value={formData.camp} onChange={handleChange} required>
                        <option value="">Select a camp</option>
                        {camps.map((camp) => (
                            <option key={camp._id} value={camp._id}>
                                {camp.name} - {camp.type} ({camp.duration})
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCamp && (
                    <div className="selected-camp-info">
                        <h3>Selected Camp Details:</h3>
                        <p>
                            <strong>Name:</strong> {selectedCamp.name}
                        </p>
                        <p>
                            <strong>Type:</strong> {selectedCamp.type}
                        </p>
                        <p>
                            <strong>Duration:</strong> {selectedCamp.duration}
                        </p>
                        <p>
                            <strong>Price:</strong> {selectedCamp.price}
                        </p>
                        <p>
                            <strong>Age Range:</strong> {selectedCamp.ageRange}
                        </p>
                        <p>
                            <strong>Experience Level:</strong> {selectedCamp.experience}
                        </p>
                    </div>
                )}

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
                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required placeholder="Your age" className={ageError ? "error" : ""} />
                    {ageError && <div className="error-message">{ageError}</div>}
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

                <button type="submit" className="submit-button" disabled={!!ageError}>
                    Register for Camp
                </button>
            </form>
        </div>
    );
}

export default CampRegistrationForm;
