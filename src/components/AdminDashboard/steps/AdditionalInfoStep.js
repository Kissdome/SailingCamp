import React from "react";
import PropTypes from "prop-types";
import "../CampForm.css";

const AdditionalInfoStep = ({ formData, handleInputChange, handleStartDateChange, addStartDateField, removeStartDateField, validationErrors }) => {
    const { description, requirements, startDates } = formData;
    const { description: descriptionError, startDates: startDatesError } = validationErrors;

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
                    value={description}
                    onChange={handleInputChange}
                    className={descriptionError ? "error" : ""}
                    placeholder="Provide a detailed description of the camp"
                    required
                />
                {descriptionError && <span className="error-text">{descriptionError}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="requirements">Requirements</label>
                <textarea id="requirements" name="requirements" value={requirements} onChange={handleInputChange} placeholder="List any specific requirements for campers" />
                <span className="help-text">Optional: Specify any prerequisites or requirements for campers</span>
            </div>
            <div className="form-group">
                <label className="required-field">Start Dates</label>
                <div className="date-inputs-container">
                    {startDates.map((date, index) => (
                        <div key={index} className="date-input-group">
                            <input
                                type="date"
                                className={`start-date-input ${startDatesError ? "error" : ""}`}
                                value={date}
                                onChange={(e) => handleStartDateChange(index, e.target.value)}
                                required
                            />
                            {startDates.length > 1 && (
                                <button type="button" className="remove-date-button" onClick={() => removeStartDateField(index)} title="Remove date">
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    {startDatesError && <span className="error-text">{startDatesError}</span>}
                    <button type="button" className="add-date-button" onClick={addStartDateField} title="Add another start date">
                        Add Another Start Date
                    </button>
                </div>
            </div>
        </div>
    );
};

AdditionalInfoStep.propTypes = {
    formData: PropTypes.shape({
        description: PropTypes.string.isRequired,
        requirements: PropTypes.string,
        startDates: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    handleStartDateChange: PropTypes.func.isRequired,
    addStartDateField: PropTypes.func.isRequired,
    removeStartDateField: PropTypes.func.isRequired,
    validationErrors: PropTypes.shape({
        description: PropTypes.string,
        startDates: PropTypes.string,
    }),
};

AdditionalInfoStep.defaultProps = {
    validationErrors: {},
};

export default AdditionalInfoStep;
