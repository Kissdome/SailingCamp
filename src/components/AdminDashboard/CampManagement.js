import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config";
import "./CampManagement.css";

const CampManagement = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCamp, setEditingCamp] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "residential",
        duration: "",
        price: "",
        description: "",
        startDates: [""],
        ageRange: "",
        experience: "beginner",
        maxCapacity: "",
        instructorCount: "",
        location: "",
        requirements: "",
    });

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
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStartDateChange = (index, value) => {
        const newStartDates = [...formData.startDates];
        newStartDates[index] = value;
        setFormData((prev) => ({
            ...prev,
            startDates: newStartDates,
        }));
    };

    const addStartDateField = () => {
        setFormData((prev) => ({
            ...prev,
            startDates: [...prev.startDates, ""],
        }));
    };

    const removeStartDateField = (index) => {
        setFormData((prev) => ({
            ...prev,
            startDates: prev.startDates.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("adminToken");
            const url = editingCamp ? `${API_ENDPOINTS.CAMPS}/${editingCamp._id}` : API_ENDPOINTS.CAMPS;

            const response = await fetch(url, {
                method: editingCamp ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to save camp");

            await fetchCamps();
            closeModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (camp) => {
        setEditingCamp(camp);
        setFormData({
            name: camp.name,
            type: camp.type,
            duration: camp.duration,
            price: camp.price,
            description: camp.description,
            startDates: camp.startDates,
            ageRange: camp.ageRange,
            experience: camp.experience,
            maxCapacity: camp.maxCapacity,
            instructorCount: camp.instructorCount,
            location: camp.location,
            requirements: camp.requirements,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (campId) => {
        if (!window.confirm("Are you sure you want to delete this camp?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`${API_ENDPOINTS.CAMPS}/${campId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete camp");

            await fetchCamps();
        } catch (err) {
            setError(err.message);
        }
    };

    const openModal = () => {
        setEditingCamp(null);
        setFormData({
            name: "",
            type: "residential",
            duration: "",
            price: "",
            description: "",
            startDates: [""],
            ageRange: "",
            experience: "beginner",
            maxCapacity: "",
            instructorCount: "",
            location: "",
            requirements: "",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCamp(null);
        setError(null);
    };

    if (loading) return <div className="loading">Loading camps...</div>;

    return (
        <div className="camp-management">
            <div className="camp-management-header">
                <h2>Camp Management</h2>
                <button onClick={openModal} className="add-camp-button">
                    Add New Camp
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="camps-grid">
                {camps.map((camp) => (
                    <div key={camp._id} className="camp-card">
                        <div className="camp-header">
                            <h3>{camp.name}</h3>
                            <span className={`camp-type ${camp.type}`}>{camp.type}</span>
                        </div>
                        <div className="camp-details">
                            <p className="camp-description">{camp.description}</p>
                            <div className="camp-info">
                                <div className="info-item">
                                    <span className="label">Duration:</span>
                                    <span className="value">{camp.duration}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Price:</span>
                                    <span className="value">{camp.price}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Age Range:</span>
                                    <span className="value">{camp.ageRange}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Experience:</span>
                                    <span className="value">{camp.experience}</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Capacity:</span>
                                    <span className="value">{camp.maxCapacity} campers</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">Instructors:</span>
                                    <span className="value">{camp.instructorCount}</span>
                                </div>
                            </div>
                            <div className="camp-dates">
                                <h4>Start Dates:</h4>
                                <ul>
                                    {camp.startDates.map((date, index) => (
                                        <li key={index}>{new Date(date).toLocaleDateString()}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="camp-actions">
                            <button onClick={() => handleEdit(camp)} className="edit-button">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(camp._id)} className="delete-button">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editingCamp ? "Edit Camp" : "Add New Camp"}</h3>
                            <button onClick={closeModal} className="close-button">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="camp-form">
                            <div className="form-group">
                                <label htmlFor="name">Camp Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">Camp Type</label>
                                <select id="type" name="type" value={formData.type} onChange={handleInputChange} required>
                                    <option value="residential">Residential</option>
                                    <option value="day">Day Camp</option>
                                    <option value="weekend">Weekend Camp</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="duration">Duration</label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1 week, 2 weeks"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input type="text" id="price" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., $599" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
                            </div>

                            <div className="form-group">
                                <label>Start Dates</label>
                                {formData.startDates.map((date, index) => (
                                    <div key={index} className="start-date-input">
                                        <input type="date" value={date} onChange={(e) => handleStartDateChange(index, e.target.value)} required />
                                        {index > 0 && (
                                            <button type="button" onClick={() => removeStartDateField(index)} className="remove-date-button">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addStartDateField} className="add-date-button">
                                    Add Another Date
                                </button>
                            </div>

                            <div className="form-group">
                                <label htmlFor="ageRange">Age Range</label>
                                <input type="text" id="ageRange" name="ageRange" value={formData.ageRange} onChange={handleInputChange} placeholder="e.g., 8-12 years" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="experience">Experience Level</label>
                                <select id="experience" name="experience" value={formData.experience} onChange={handleInputChange} required>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="maxCapacity">Maximum Capacity</label>
                                <input type="number" id="maxCapacity" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} min="1" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="instructorCount">Number of Instructors</label>
                                <input type="number" id="instructorCount" name="instructorCount" value={formData.instructorCount} onChange={handleInputChange} min="1" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="requirements">Requirements</label>
                                <textarea
                                    id="requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleInputChange}
                                    placeholder="List any prerequisites or requirements for the camp"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="submit-button">
                                    {editingCamp ? "Update Camp" : "Create Camp"}
                                </button>
                                <button type="button" onClick={closeModal} className="cancel-button">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampManagement;
