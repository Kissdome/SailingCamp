import React, { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/Notification/Notification";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = "info") => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);

        // Auto remove notification after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="notification-container">
                {notifications.map((notification) => (
                    <Notification key={notification.id} message={notification.message} type={notification.type} onClose={() => removeNotification(notification.id)} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
