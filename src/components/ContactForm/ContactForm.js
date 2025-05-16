import React, { useState } from "react";
import PropTypes from "prop-types";
import { API_ENDPOINTS } from "../../config";
import "./ContactForm.css";
import { useNotification } from "../../context/NotificationContext";

const ContactForm = ({ onSubmit }) => {
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_ENDPOINTS.CONTACT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setFormData({
                name: "",
                email: "",
                message: "",
            });
            addNotification("Thank you for your message! We will get back to you soon.", "success");
        } catch (error) {
            console.error("Error sending message:", error);
            addNotification("Failed to send message. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const { name, email, message } = formData;

    return (
        <div className="contact-form-container">
            <h2>Reach Us</h2>
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={name} onChange={handleChange} required placeholder="Your name" />
                </div>

                <div className="contact-form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={handleChange} required placeholder="Your email" />
                </div>

                <div className="contact-form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" value={message} onChange={handleChange} required placeholder="Your message" rows="4" />
                </div>

                <button type="submit" className="contact-form-submit">
                    Send Message
                </button>
            </form>
        </div>
    );
};

ContactForm.propTypes = {
    onSubmit: PropTypes.func,
};

export default ContactForm;
