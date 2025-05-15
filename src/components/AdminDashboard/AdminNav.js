import React from "react";
import "./AdminNav.css";

const AdminNav = ({ activeSection, onSectionChange }) => {
    const sections = [
        { id: "applications", label: "Applications" },
        { id: "add-applicant", label: "Add Applicant" },
        { id: "photos", label: "Photos" },
        { id: "camps", label: "Camps" },
        { id: "instructors", label: "Instructors" },
        { id: "reports", label: "Reports" },
        { id: "settings", label: "Settings" },
    ];

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
