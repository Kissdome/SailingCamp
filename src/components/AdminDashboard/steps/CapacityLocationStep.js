import React from "react";
import PropTypes from "prop-types";
import "../CampForm.css";

const CapacityLocationStep = ({ formData, handleInputChange, validationErrors }) => {
    const { maxCapacity, instructorCount, location } = formData;
    const { maxCapacity: maxCapacityError, instructorCount: instructorCountError, location: locationError } = validationErrors;

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
                        value={maxCapacity}
                        onChange={handleInputChange}
                        min="1"
                        className={maxCapacityError ? "error" : ""}
                        required
                    />
                    {maxCapacityError && <span className="error-text">{maxCapacityError}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="instructorCount" className="required-field">
                        Number of Instructors
                    </label>
                    <input
                        type="number"
                        id="instructorCount"
                        name="instructorCount"
                        value={instructorCount}
                        onChange={handleInputChange}
                        min="1"
                        className={instructorCountError ? "error" : ""}
                        required
                    />
                    {instructorCountError && <span className="error-text">{instructorCountError}</span>}
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                    <label htmlFor="location" className="required-field">
                        Location
                    </label>
                    <input type="text" id="location" name="location" value={location} onChange={handleInputChange} className={locationError ? "error" : ""} required />
                    {locationError && <span className="error-text">{locationError}</span>}
                </div>
            </div>
        </div>
    );
};

CapacityLocationStep.propTypes = {
    formData: PropTypes.shape({
        maxCapacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        instructorCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        location: PropTypes.string.isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    validationErrors: PropTypes.shape({
        maxCapacity: PropTypes.string,
        instructorCount: PropTypes.string,
        location: PropTypes.string,
    }),
};

CapacityLocationStep.defaultProps = {
    validationErrors: {},
};

export default CapacityLocationStep;
