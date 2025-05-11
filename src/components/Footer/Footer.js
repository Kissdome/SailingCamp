import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: info@sailingcamps.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Address: 123 Sailing Street, Marina Bay, CA 90210</p>
                </div>
                <div className="footer-section">
                    <h3>Business Hours</h3>
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            Facebook
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            Instagram
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            Twitter
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Sailing Camps. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
