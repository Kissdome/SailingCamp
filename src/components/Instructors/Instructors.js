import React, { useState, useEffect } from "react";
import "./Instructors.css";

function Instructors() {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/instructors");
                if (!response.ok) {
                    throw new Error("Failed to fetch instructors");
                }
                const data = await response.json();
                setInstructors(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching instructors:", err);
                setError("Failed to load instructors. Please try again later.");
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    if (loading) {
        return (
            <div className="instructors-section">
                <h2>Our Expert Instructors</h2>
                <div className="loading-message">Loading instructors...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="instructors-section">
                <h2>Our Expert Instructors</h2>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="instructors-section">
            <h2>Our Expert Instructors</h2>
            <div className="instructors-grid">
                {instructors.map((instructor) => (
                    <div key={instructor._id} className="instructor-card">
                        <div className="instructor-image">
                            <img src={instructor.image} alt={instructor.name} />
                        </div>
                        <div className="instructor-info">
                            <h3>{instructor.name}</h3>
                            <p className="instructor-role">{instructor.role}</p>
                            <p className="instructor-experience">Experience: {instructor.experience}</p>
                            <div className="instructor-specialties">
                                <h4>Specialties:</h4>
                                <ul>
                                    {instructor.specialties.map((specialty, index) => (
                                        <li key={index}>{specialty}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="instructor-bio">{instructor.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Instructors;
