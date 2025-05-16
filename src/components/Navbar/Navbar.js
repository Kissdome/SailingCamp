import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMenuOpen]);

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
                <button className={`menu-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu} aria-label="Toggle navigation menu">
                    <span className="menu-icon"></span>
                </button>
                <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
                    {navItems.map(({ path, label }) => (
                        <li key={path}>
                            <Link to={path} className={isActive(path) ? "active" : ""} onClick={() => setIsMenuOpen(false)}>
                                {label}
                            </Link>
                        </li>
                    ))}
                    {onLogout && (
                        <li>
                            <button
                                onClick={() => {
                                    onLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="logout-button"
                            >
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
