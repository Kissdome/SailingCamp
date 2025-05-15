import React from "react";
import PropTypes from "prop-types";
import "../CampForm.css";

const CampDetailsStep = ({ formData, handleInputChange, validationErrors }) => {
    const { duration, price, ageRange, experience } = formData;
    const { duration: durationError, price: priceError, ageRange: ageRangeError, experience: experienceError } = validationErrors;

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
                        value={duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 1 week, 2 weeks"
                        className={durationError ? "error" : ""}
                        required
                    />
                    {durationError && <span className="error-text">{durationError}</span>}
                    <span className="help-text">Specify the duration of the camp</span>
                </div>
                <div className="form-group">
                    <label htmlFor="price" className="required-field">
                        Price
                    </label>
                    <input type="text" id="price" name="price" value={price} onChange={handleInputChange} placeholder="e.g., $500" className={priceError ? "error" : ""} required />
                    {priceError && <span className="error-text">{priceError}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="ageRange" className="required-field">
                        Age Range
                    </label>
                    <input
                        type="text"
                        id="ageRange"
                        name="ageRange"
                        value={ageRange}
                        onChange={handleInputChange}
                        placeholder="e.g., 8-12 years"
                        className={ageRangeError ? "error" : ""}
                        required
                    />
                    {ageRangeError && <span className="error-text">{ageRangeError}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="experience" className="required-field">
                        Experience Level
                    </label>
                    <select id="experience" name="experience" value={experience} onChange={handleInputChange} className={experienceError ? "error" : ""} required>
                        <option value="">Select experience level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    {experienceError && <span className="error-text">{experienceError}</span>}
                </div>
            </div>
        </div>
    );
};

CampDetailsStep.propTypes = {
    formData: PropTypes.shape({
        duration: PropTypes.string.isRequired,
        price: PropTypes.string.isRequired,
        ageRange: PropTypes.string.isRequired,
        experience: PropTypes.string.isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    validationErrors: PropTypes.shape({
        duration: PropTypes.string,
        price: PropTypes.string,
        ageRange: PropTypes.string,
        experience: PropTypes.string,
    }),
};

CampDetailsStep.defaultProps = {
    validationErrors: {},
};

export default CampDetailsStep;
