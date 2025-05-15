import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/about", label: "About" },
        { path: "/register", label: "Register" },
        { path: "/contact", label: "Contact" },
        { path: "/location", label: "Location" },
    ];

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand">
                    Sailing Camps
                </Link>
                <button className="menu-toggle" onClick={toggleMenu}>
                    <span className="menu-icon"></span>
                </button>
                <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
                    {navItems.map(({ path, label }) => (
                        <li key={path}>
                            <Link to={path} className={isActive(path) ? "active" : ""}>
                                {label}
                            </Link>
                        </li>
                    ))}
                    {onLogout && (
                        <li>
                            <button onClick={onLogout} className="logout-button">
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    onLogout: PropTypes.func,
};

export default Navbar;
