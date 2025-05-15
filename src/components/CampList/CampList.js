import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CampList.css";

const CampList = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCamps = async () => {
            try {
                console.log("Fetching camps...");
                const response = await fetch("http://localhost:5001/api/camps", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });

                console.log("Response status:", response.status);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch camps");
                }

                const data = await response.json();
                console.log("Camps data received:", data);
                setCamps(data);
                setLoading(false);
            } catch (err) {
                console.error("Error in fetchCamps:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCamps();
    }, []);

    const handleRegisterClick = (camp) => {
        // Store the selected camp data in localStorage
        localStorage.setItem("selectedCamp", JSON.stringify(camp));
        // Navigate to the registration form
        navigate("/register");
    };

    const getCapacityStatus = (camp) => {
        const currentApplicants = camp.applicants ? camp.applicants.length : 0;
        const isFull = currentApplicants >= camp.maxCapacity;
        const remainingSpots = camp.maxCapacity - currentApplicants;

        return {
            isFull,
            remainingSpots,
            status: isFull ? "Full" : `${remainingSpots} spots remaining`,
        };
    };

    if (loading) {
        return (
            <section className="camp-list-section">
                <h2>Our Sailing Camps</h2>
                <div className="loading">Loading camps...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="camp-list-section">
                <h2>Our Sailing Camps</h2>
                <div className="error">Error: {error}</div>
            </section>
        );
    }

    return (
        <section className="camp-list-section">
            <h2>Our Sailing Camps</h2>
            <div className="camp-list">
                {camps.map((camp) => {
                    const capacityStatus = getCapacityStatus(camp);
                    return (
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
                                        <span className={`value ${capacityStatus.isFull ? "full" : ""}`}>{capacityStatus.status}</span>
                                    </div>
                                </div>
                                <div className="camp-dates">
                                    <h4>Available Start Dates:</h4>
                                    <ul>
                                        {camp.startDates.map((date, index) => (
                                            <li key={index}>{new Date(date).toLocaleDateString()}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="register-button-container">
                                    <button
                                        className={`register-button ${capacityStatus.isFull ? "disabled" : ""}`}
                                        onClick={() => handleRegisterClick(camp)}
                                        disabled={capacityStatus.isFull}
                                    >
                                        {capacityStatus.isFull ? "Camp Full" : "Register Now"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default CampList;
