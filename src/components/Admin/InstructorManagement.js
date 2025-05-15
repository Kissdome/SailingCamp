import React, { useState, useEffect } from "react";
import "./InstructorManagement.css";

function InstructorManagement() {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingInstructor, setEditingInstructor] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        experience: "",
        specialties: "",
        bio: "",
        image: "",
    });

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                throw new Error("No authentication token found");
            }
            const response = await fetch("http://localhost:5001/api/instructors/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch instructors");
            const data = await response.json();
            setInstructors(data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                throw new Error("No authentication token found");
            }
            const instructorData = {
                ...formData,
                specialties: formData.specialties.split(",").map((s) => s.trim()),
            };

            const url = editingInstructor ? `http://localhost:5001/api/instructors/${editingInstructor._id}` : "http://localhost:5001/api/instructors";

            const method = editingInstructor ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(instructorData),
            });

            if (!response.ok) throw new Error("Failed to save instructor");

            await fetchInstructors();
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (instructor) => {
        setEditingInstructor(instructor);
        setFormData({
            name: instructor.name,
            role: instructor.role,
            experience: instructor.experience,
            specialties: instructor.specialties.join(", "),
            bio: instructor.bio,
            image: instructor.image,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this instructor?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                throw new Error("No authentication token found");
            }
            const response = await fetch(`http://localhost:5001/api/instructors/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to delete instructor");

            await fetchInstructors();
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setEditingInstructor(null);
        setFormData({
            name: "",
            role: "",
            experience: "",
            specialties: "",
            bio: "",
            image: "",
        });
    };

    if (loading) return <div className="instructor-management-loading">Loading instructors...</div>;
    if (error) return <div className="instructor-management-error">{error}</div>;

    return (
        <div className="instructor-management-container">
            <h2 className="instructor-management-title">{editingInstructor ? "Edit Instructor" : "Add New Instructor"}</h2>

            <form onSubmit={handleSubmit} className="instructor-management-form">
                <div className="instructor-management-form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>

                <div className="instructor-management-form-group">
                    <label htmlFor="role">Role:</label>
                    <input type="text" id="role" name="role" value={formData.role} onChange={handleInputChange} required />
                </div>

                <div className="instructor-management-form-group">
                    <label htmlFor="experience">Experience:</label>
                    <input type="text" id="experience" name="experience" value={formData.experience} onChange={handleInputChange} required />
                </div>

                <div className="instructor-management-form-group">
                    <label htmlFor="specialties">Specialties (comma-separated):</label>
                    <input type="text" id="specialties" name="specialties" value={formData.specialties} onChange={handleInputChange} required />
                </div>

                <div className="instructor-management-form-group">
                    <label htmlFor="bio">Bio:</label>
                    <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} required />
                </div>

                <div className="instructor-management-form-group">
                    <label htmlFor="image">Image URL:</label>
                    <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} required />
                </div>

                <div className="instructor-management-form-buttons">
                    <button type="submit" className="instructor-management-submit-btn">
                        {editingInstructor ? "Update Instructor" : "Add Instructor"}
                    </button>
                    {editingInstructor && (
                        <button type="button" onClick={resetForm} className="instructor-management-cancel-btn">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <h2 className="instructor-management-title">Current Instructors</h2>
            <div className="instructor-management-list">
                {instructors.map((instructor) => (
                    <div key={instructor._id} className="instructor-management-item">
                        <div className="instructor-management-info">
                            <h3>{instructor.name}</h3>
                            <p>
                                <strong>Role:</strong> {instructor.role}
                            </p>
                            <p>
                                <strong>Experience:</strong> {instructor.experience}
                            </p>
                            <p>
                                <strong>Specialties:</strong> {instructor.specialties.join(", ")}
                            </p>
                            <p>
                                <strong>Status:</strong> {instructor.isActive ? "Active" : "Inactive"}
                            </p>
                        </div>
                        <div className="instructor-management-actions">
                            <button onClick={() => handleEdit(instructor)} className="instructor-management-edit-btn">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(instructor._id)} className="instructor-management-delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InstructorManagement;
