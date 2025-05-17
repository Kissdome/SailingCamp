import React from "react";
import "./Notification.css";

const Notification = ({ message, type = "info", onClose }) => {
    return (
        <div className={`notification ${type}`}>
            <div className="notification-content">
                <span className="notification-message">{message}</span>
                <button className="notification-close" onClick={onClose}>
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification;
