import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { API_ENDPOINTS } from "../config";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import "./Admin.css";

const Admin = ({ onLoginSuccess }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) throw new Error("Invalid credentials");

            const data = await response.json();
            localStorage.setItem("adminToken", data.token);
            setIsLoggedIn(true);
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        setIsLoggedIn(false);
        navigate("/");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (!isLoggedIn) {
        const { username, password } = loginData;
        return (
            <div className="admin-login">
                <h2>Admin Login</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={username} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" value={password} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="submit-button">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return <AdminDashboard onLogout={handleLogout} />;
};

Admin.propTypes = {
    onLoginSuccess: PropTypes.func,
};

export default Admin;
