import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

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
                    <li>
                        <Link to="/" className={isActive("/") ? "active" : ""}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className={isActive("/about") ? "active" : ""}>
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" className={isActive("/register") ? "active" : ""}>
                            Register
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className={isActive("/contact") ? "active" : ""}>
                            Contact
                        </Link>
                    </li>
                    <li>
                        <Link to="/location" className={isActive("/location") ? "active" : ""}>
                            Location
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin" className="admin-link">
                            Admin
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
