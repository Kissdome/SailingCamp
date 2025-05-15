import React from "react";
import "../CampForm.css";

const StepIndicator = ({ currentStep, totalSteps }) => {
    return (
        <div className="step-indicator">
            {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className={`step ${i + 1 === currentStep ? "active" : i + 1 < currentStep ? "completed" : ""}`}>
                    <div className="step-number">{i + 1}</div>
                    <div className="step-label">{i === 0 ? "Basic Info" : i === 1 ? "Camp Details" : i === 2 ? "Capacity & Location" : "Additional Info"}</div>
                </div>
            ))}
        </div>
    );
};

export default StepIndicator;
