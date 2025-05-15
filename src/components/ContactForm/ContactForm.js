import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ContactForm.css";

const ContactForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(formData);
        } else {
            console.log("Form submitted:", formData);
            alert("Thank you for your message! We will get back to you soon.");
            setFormData({ name: "", email: "", message: "" });
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
