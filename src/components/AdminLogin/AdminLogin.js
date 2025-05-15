/**
 * AdminLogin Component
 *
 * This component handles the admin authentication process.
 * It provides a login form for administrators to access the admin dashboard.
 * The component manages login state, handles form submission, and stores the authentication token.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config";
import "./AdminLogin.css";

const AdminLogin = ({ onLogin }) => {
    // State for form credentials and UI feedback
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState(""); // Stores error messages
    const [loading, setLoading] = useState(false); // Loading state for form submission

    /**
     * Handles input changes in the login form
     * Updates the credentials state with the new input value
     * @param {Event} e - The change event from the input field
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Handles form submission for admin login
     * Makes an API call to authenticate the admin
     * Stores the authentication token on successful login
     * @param {Event} e - The form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Store the authentication token
            localStorage.setItem("adminToken", data.token);
            onLogin(); // Call the parent component's login handler
        } catch (err) {
            setError(err.message || "Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Render the login form
    return (
        <div className="admin-login-container">
            <div className="admin-login">
                <h2>Admin Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={credentials.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={credentials.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
