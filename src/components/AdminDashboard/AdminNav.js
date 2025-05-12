import React from "react";
import "./AdminNav.css";

const AdminNav = ({ activeSection, onSectionChange }) => {
    const menuItems = [
        { id: "applications", label: "Applications", icon: "📋" },
        { id: "photos", label: "Photo Management", icon: "📸" },
        { id: "camps", label: "Camp Management", icon: "⛵" },
        { id: "reports", label: "Reports", icon: "📊" },
        { id: "settings", label: "Settings", icon: "⚙️" },
    ];

    return (
        <nav className="admin-nav">
            <ul className="admin-nav-list">
                {menuItems.map((item) => (
                    <li key={item.id} className={`admin-nav-item ${activeSection === item.id ? "active" : ""}`} onClick={() => onSectionChange(item.id)}>
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default AdminNav;
