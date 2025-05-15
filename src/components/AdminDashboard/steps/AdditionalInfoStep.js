import React from "react";
import "../CampForm.css";

const AdditionalInfoStep = ({ formData, handleInputChange, handleStartDateChange, addStartDateField, removeStartDateField, validationErrors }) => {
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
};

export default AdditionalInfoStep;
