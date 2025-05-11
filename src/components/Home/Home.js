import React from "react";
import { Link } from "react-router-dom";
import CampList from "../CampList/CampList";
import "./Home.css";

const Home = () => {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to Our Sailing Camp</h1>
                    <p>Experience the freedom of the open sea and the joy of sailing!</p>
                    <Link to="/register" className="cta-button">
                        Register Now
                    </Link>
                </div>
            </section>

            <CampList />

            <section className="features">
                <h2>Why Choose Our Camp?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Expert Sailors</h3>
                        <p>Learn from experienced sailing instructors</p>
                    </div>
                    <div className="feature-card">
                        <h3>Modern Fleet</h3>
                        <p>State-of-the-art boats and safety equipment</p>
                    </div>
                    <div className="feature-card">
                        <h3>Flexible Programs</h3>
                        <p>Choose from residential or walk-in options</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
