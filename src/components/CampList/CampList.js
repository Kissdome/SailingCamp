import React from "react";
import { Link } from "react-router-dom";
import "./CampList.css";

const CampList = () => {
    const camps = [
        {
            id: 1,
            name: "Beginner Sailing Camp",
            type: "residential",
            duration: "1 week",
            price: "$599",
            description: "Perfect for first-time sailors. Learn basic sailing skills, water safety, and boat handling.",
            startDates: ["2024-06-15", "2024-07-01", "2024-07-15"],
            ageRange: "8-12 years",
            experience: "beginner",
        },
        {
            id: 2,
            name: "Intermediate Sailing Camp",
            type: "residential",
            duration: "2 weeks",
            price: "$999",
            description: "Build on your sailing skills with advanced techniques, racing strategies, and navigation.",
            startDates: ["2024-06-20", "2024-07-10", "2024-07-25"],
            ageRange: "12-16 years",
            experience: "intermediate",
        },
        {
            id: 3,
            name: "Weekend Sailing Camp",
            type: "walk-in",
            duration: "3 days",
            price: "$299",
            description: "Perfect for busy families. Intensive weekend program covering essential sailing skills.",
            startDates: ["2024-06-01", "2024-06-15", "2024-06-29"],
            ageRange: "10-14 years",
            experience: "beginner",
        },
        {
            id: 4,
            name: "Advanced Racing Camp",
            type: "residential",
            duration: "2 weeks",
            price: "$1,199",
            description: "For experienced sailors. Focus on competitive racing, advanced techniques, and regatta preparation.",
            startDates: ["2024-07-01", "2024-07-15", "2024-07-29"],
            ageRange: "14-18 years",
            experience: "advanced",
        },
    ];

    return (
        <section className="camp-list-section">
            <h2>Our Sailing Camps</h2>
            <div className="camp-list">
                {camps.map((camp) => (
                    <div key={camp.id} className="camp-card">
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
                            </div>
                            <div className="camp-dates">
                                <h4>Available Start Dates:</h4>
                                <ul>
                                    {camp.startDates.map((date, index) => (
                                        <li key={index}>{new Date(date).toLocaleDateString()}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <Link to="/register" className="register-button">
                            Register Now
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CampList;
