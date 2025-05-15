import React from "react";
import PropTypes from "prop-types";
import "../CampForm.css";

const BasicInfoStep = ({ formData, handleInputChange, validationErrors }) => {
    const { name, type } = formData;
    const { name: nameError, type: typeError } = validationErrors;

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
                        value={name}
                        onChange={handleInputChange}
                        placeholder="Enter camp name"
                        className={nameError ? "error" : ""}
                        required
                    />
                    {nameError && <span className="error-text">{nameError}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="type" className="required-field">
                        Camp Type
                    </label>
                    <select id="type" name="type" value={type} onChange={handleInputChange} className={typeError ? "error" : ""} required>
                        <option value="">Select camp type</option>
                        <option value="residential">Residential Camp (Overnight Stay)</option>
                        <option value="walk-in">Walk-in Camp (Day Program)</option>
                    </select>
                    {typeError && <span className="error-text">{typeError}</span>}
                </div>
            </div>
        </div>
    );
};

BasicInfoStep.propTypes = {
    formData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    }).isRequired,
    handleInputChange: PropTypes.func.isRequired,
    validationErrors: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
    }),
};

BasicInfoStep.defaultProps = {
    validationErrors: {},
};

export default BasicInfoStep;
