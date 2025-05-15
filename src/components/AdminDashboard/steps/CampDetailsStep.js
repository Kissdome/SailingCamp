import React from "react";
import "../CampForm.css";

const CampDetailsStep = ({ formData, handleInputChange, validationErrors }) => {
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
};

export default CampDetailsStep;
