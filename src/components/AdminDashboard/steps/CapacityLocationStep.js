import React from "react";
import "../CampForm.css";

const CapacityLocationStep = ({ formData, handleInputChange, validationErrors }) => {
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
};

export default CapacityLocationStep;
