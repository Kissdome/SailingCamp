/**
 * AdminNav Component
 *
 * Navigation component for the admin dashboard.
 * Provides a list of navigation buttons to switch between different sections
 * of the admin interface. Each section represents a different administrative function.
 */

import React from "react";
import "./AdminNav.css";

const AdminNav = ({ activeSection, onSectionChange }) => {
    // Define available sections in the admin dashboard
    const sections = [
        { id: "applications", label: "Applications" }, // View and manage applications
        { id: "add-applicant", label: "Add Applicant" }, // Add new applicant manually
        { id: "photos", label: "Photos" }, // Manage camp photos
        { id: "camps", label: "Camps" }, // Manage camp information
        { id: "instructors", label: "Instructors" }, // Manage instructor information
        { id: "reports", label: "Reports" }, // View and generate reports
        { id: "settings", label: "Settings" }, // Admin settings
    ];

    // Render the navigation menu
    return (
        <nav className="admin-nav">
            {sections.map((section) => (
                <button key={section.id} className={`nav-button ${activeSection === section.id ? "active" : ""}`} onClick={() => onSectionChange(section.id)}>
                    {section.label}
                </button>
            ))}
        </nav>
    );
};

export default AdminNav;
