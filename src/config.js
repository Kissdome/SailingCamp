// API Configuration
export const API_URL = "http://localhost:5001";

// API Endpoints
export const API_ENDPOINTS = {
    // Admin endpoints
    LOGIN: `${API_URL}/api/admin/login`,
    LOGOUT: `${API_URL}/api/admin/logout`,

    // Application endpoints
    APPLICANTS: `${API_URL}/api/applicants`,
    SUBMIT_APPLICATION: `${API_URL}/api/applications`,

    // Camp endpoints
    CAMPS: `${API_URL}/api/camps`,
    CAMP_TYPES: `${API_URL}/api/camp-types`,

    // Test endpoint
    TEST_CONNECTION: `${API_URL}/api/test`,
};

// Application Configuration
export const APP_CONFIG = {
    APP_NAME: "Sailing Camps",
    VERSION: "1.0.0",
    ENVIRONMENT: process.env.NODE_ENV || "development",
};

// Form Configuration
export const FORM_CONFIG = {
    MIN_AGE: 8,
    MAX_AGE: 18,
    EXPERIENCE_LEVELS: ["beginner", "intermediate", "advanced"],
    CAMP_TYPES: ["residential", "walk-in"],
};

// Validation Configuration
export const VALIDATION_CONFIG = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
};

// UI Configuration
export const UI_CONFIG = {
    ITEMS_PER_PAGE: 10,
    DATE_FORMAT: "YYYY-MM-DD",
    TIME_FORMAT: "HH:mm",
    CURRENCY: "USD",
};

// Error Messages
export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: "Invalid username or password",
    NETWORK_ERROR: "Network error. Please try again.",
    SERVER_ERROR: "Server error. Please try again later.",
    VALIDATION_ERROR: "Please check your input and try again.",
    DUPLICATE_EMAIL: "This email is already registered.",
    REQUIRED_FIELD: "This field is required.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_AGE: "Age must be between 8 and 18 years.",
    INVALID_DATE: "Please select a valid date.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: "Login successful!",
    LOGOUT_SUCCESS: "Logged out successfully!",
    APPLICATION_SUBMITTED: "Application submitted successfully!",
    APPLICATION_UPDATED: "Application updated successfully!",
    APPLICATION_DELETED: "Application deleted successfully!",
};

// Export all configurations
export default {
    API_URL,
    API_ENDPOINTS,
    APP_CONFIG,
    FORM_CONFIG,
    VALIDATION_CONFIG,
    UI_CONFIG,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
};
