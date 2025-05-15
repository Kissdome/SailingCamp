import React from "react";
import PropTypes from "prop-types";
import "../CampForm.css";

const StepIndicator = ({ currentStep, totalSteps }) => {
    const getStepLabel = (index) => {
        switch (index) {
            case 0:
                return "Basic Info";
            case 1:
                return "Camp Details";
            case 2:
                return "Capacity & Location";
            default:
                return "Additional Info";
        }
    };

    return (
        <div className="step-indicator">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className={`step ${i + 1 === currentStep ? "active" : i + 1 < currentStep ? "completed" : ""}`}>
                    <div className="step-number">{i + 1}</div>
                    <div className="step-label">{getStepLabel(i)}</div>
                </div>
            ))}
        </div>
    );
};

StepIndicator.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
};

export default StepIndicator;
