import React, { useState } from "react";
import "./CampForm.css";

const CampForm = ({ formData, handleInputChange, handleStartDateChange, addStartDateField, removeStartDateField, handleSubmit, closeModal, editingCamp, error }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [validationErrors, setValidationErrors] = useState({});
    const totalSteps = 4;

    const validateStep = (step) => {
        const errors = {};

        switch (step) {
            case 1:
                if (!formData.name) errors.name = "Camp name is required";
                if (!formData.type) errors.type = "Camp type is required";
                break;
            case 2:
                if (!formData.duration) errors.duration = "Duration is required";
                if (!formData.price) errors.price = "Price is required";
                if (!formData.ageRange) errors.ageRange = "Age range is required";
                if (!formData.experience) errors.experience = "Experience level is required";
                break;
            case 3:
                if (!formData.maxCapacity) errors.maxCapacity = "Maximum capacity is required";
                if (!formData.instructorCount) errors.instructorCount = "Number of instructors is required";
                if (!formData.location) errors.location = "Location is required";
                break;
            case 4:
                if (!formData.description) errors.description = "Description is required";
                if (formData.startDates.length === 0 || formData.startDates.some((date) => !date)) {
                    errors.startDates = "At least one start date is required";
                }
                break;
            default:
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            handleSubmit(e);
        }
    };

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className={`step ${i + 1 === currentStep ? "active" : i + 1 < currentStep ? "completed" : ""}`}>
                    <div className="step-number">{i + 1}</div>
                    <div className="step-label">{i === 0 ? "Basic Info" : i === 1 ? "Camp Details" : i === 2 ? "Capacity & Location" : "Additional Info"}</div>
                </div>
            ))}
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-section">
                        <h4>Basic Information</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="name" className="required-field">
                                    Camp Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter camp name"
                                    className={validationErrors.name ? "error" : ""}
                                    required
                                />
                                {validationErrors.name && <span className="error-text">{validationErrors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="type" className="required-field">
                                    Camp Type
                                </label>
                                <select id="type" name="type" value={formData.type} onChange={handleInputChange} className={validationErrors.type ? "error" : ""} required>
                                    <option value="">Select camp type</option>
                                    <option value="residential">Residential</option>
                                    <option value="day">Day Camp</option>
                                    <option value="weekend">Weekend Camp</option>
                                </select>
                                {validationErrors.type && <span className="error-text">{validationErrors.type}</span>}
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="form-section">
                        <h4>Camp Details</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="duration" className="required-field">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1 week, 2 weeks"
                                    className={validationErrors.duration ? "error" : ""}
                                    required
                                />
                                {validationErrors.duration && <span className="error-text">{validationErrors.duration}</span>}
                                <span className="help-text">Specify the duration of the camp</span>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price" className="required-field">
                                    Price
                                </label>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g., $500"
                                    className={validationErrors.price ? "error" : ""}
                                    required
                                />
                                {validationErrors.price && <span className="error-text">{validationErrors.price}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="ageRange" className="required-field">
                                    Age Range
                                </label>
                                <input
                                    type="text"
                                    id="ageRange"
                                    name="ageRange"
                                    value={formData.ageRange}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 8-12 years"
                                    className={validationErrors.ageRange ? "error" : ""}
                                    required
                                />
                                {validationErrors.ageRange && <span className="error-text">{validationErrors.ageRange}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="experience" className="required-field">
                                    Experience Level
                                </label>
                                <select
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className={validationErrors.experience ? "error" : ""}
                                    required
                                >
                                    <option value="">Select experience level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                {validationErrors.experience && <span className="error-text">{validationErrors.experience}</span>}
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="form-section">
                        <h4>Capacity & Location</h4>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="maxCapacity" className="required-field">
                                    Maximum Capacity
                                </label>
                                <input
                                    type="number"
                                    id="maxCapacity"
                                    name="maxCapacity"
                                    value={formData.maxCapacity}
                                    onChange={handleInputChange}
                                    min="1"
                                    className={validationErrors.maxCapacity ? "error" : ""}
                                    required
                                />
                                {validationErrors.maxCapacity && <span className="error-text">{validationErrors.maxCapacity}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="instructorCount" className="required-field">
                                    Number of Instructors
                                </label>
                                <input
                                    type="number"
                                    id="instructorCount"
                                    name="instructorCount"
                                    value={formData.instructorCount}
                                    onChange={handleInputChange}
                                    min="1"
                                    className={validationErrors.instructorCount ? "error" : ""}
                                    required
                                />
                                {validationErrors.instructorCount && <span className="error-text">{validationErrors.instructorCount}</span>}
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                                <label htmlFor="location" className="required-field">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className={validationErrors.location ? "error" : ""}
                                    required
                                />
                                {validationErrors.location && <span className="error-text">{validationErrors.location}</span>}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="form-section">
                        <h4>Additional Information</h4>
                        <div className="form-group">
                            <label htmlFor="description" className="required-field">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={validationErrors.description ? "error" : ""}
                                placeholder="Provide a detailed description of the camp"
                                required
                            />
                            {validationErrors.description && <span className="error-text">{validationErrors.description}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="requirements">Requirements</label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleInputChange}
                                placeholder="List any specific requirements for campers"
                            />
                            <span className="help-text">Optional: Specify any prerequisites or requirements for campers</span>
                        </div>
                        <div className="form-group">
                            <label className="required-field">Start Dates</label>
                            <div className="date-inputs-container">
                                {formData.startDates.map((date, index) => (
                                    <div key={index} className="date-input-group">
                                        <input
                                            type="date"
                                            className={`start-date-input ${validationErrors.startDates ? "error" : ""}`}
                                            value={date}
                                            onChange={(e) => handleStartDateChange(index, e.target.value)}
                                            required
                                        />
                                        {formData.startDates.length > 1 && (
                                            <button type="button" className="remove-date-button" onClick={() => removeStartDateField(index)} title="Remove date">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {validationErrors.startDates && <span className="error-text">{validationErrors.startDates}</span>}
                                <button type="button" className="add-date-button" onClick={addStartDateField} title="Add another start date">
                                    Add Another Start Date
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="admin-camp-form">
            {renderStepIndicator()}

            {renderStepContent()}

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                {currentStep > 1 && (
                    <button type="button" className="back-button" onClick={handleBack}>
                        Back
                    </button>
                )}
                {currentStep < totalSteps ? (
                    <button type="button" className="next-button" onClick={handleNext}>
                        Next
                    </button>
                ) : (
                    <button type="submit" className="submit-button">
                        {editingCamp ? "Update Camp" : "Create Camp"}
                    </button>
                )}
                <button type="button" className="cancel-button" onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CampForm;
