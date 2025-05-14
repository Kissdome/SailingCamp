import React from "react";
import Instructors from "../Instructors/Instructors";
import "./About.css";

function About() {
    return (
        <div className="page-container about-page">
            <div className="content-overlay">
                <div className="about-content">
                    <div className="about-section">
                        <h1>About Our Sailing School</h1>
                        <p>
                            Welcome to our premier sailing school! We are passionate about sharing the joy of sailing with people of all ages and experience levels. Our expert
                            instructors and state-of-the-art facilities make us the perfect place to learn and master the art of sailing.
                        </p>
                        <p>
                            Whether you're a complete beginner or looking to enhance your sailing skills, our comprehensive programs are designed to provide you with the knowledge,
                            confidence, and practical experience needed to become a skilled sailor. We offer both residential and walk-in camp options to accommodate your
                            preferences and schedule.
                        </p>
                        <p>
                            Our commitment to safety, quality instruction, and personalized attention ensures that every student receives the best possible sailing education. Join
                            us on this exciting journey and discover the freedom and adventure that sailing has to offer!
                        </p>
                    </div>

                    <Instructors />
                </div>
            </div>
        </div>
    );
}

export default About;
