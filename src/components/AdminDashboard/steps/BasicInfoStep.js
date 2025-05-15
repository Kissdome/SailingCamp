import React from "react";
import "../CampForm.css";

const BasicInfoStep = ({ formData, handleInputChange, validationErrors }) => {
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
};

export default BasicInfoStep;
