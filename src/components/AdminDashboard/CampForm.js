import React, { useState } from "react";
import "./CampForm.css";
import StepIndicator from "./steps/StepIndicator";
import BasicInfoStep from "./steps/BasicInfoStep";
import CampDetailsStep from "./steps/CampDetailsStep";
import CapacityLocationStep from "./steps/CapacityLocationStep";
import AdditionalInfoStep from "./steps/AdditionalInfoStep";
import FormActions from "./steps/FormActions";

const CampForm = ({ formData, handleInputChange, handleStartDateChange, addStartDateField, removeStartDateField, handleSubmit, closeModal, editingCamp, error }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [validationErrors, setValidationErrors] = useState({});
    const totalSteps = 4;

    const validateStep = (step) => {
        const errors = {};

        switch (step) {
            case 1:
                if (!formData.name) errors.name = "Camp name is required";
                if (!formData.type) errors.type = "Camp type is required";
                break;
            case 2:
                if (!formData.duration) errors.duration = "Duration is required";
                if (!formData.price) errors.price = "Price is required";
                if (!formData.ageRange) errors.ageRange = "Age range is required";
                if (!formData.experience) errors.experience = "Experience level is required";
                break;
            case 3:
                if (!formData.maxCapacity) errors.maxCapacity = "Maximum capacity is required";
                if (!formData.instructorCount) errors.instructorCount = "Number of instructors is required";
                if (!formData.location) errors.location = "Location is required";
                break;
            case 4:
                if (!formData.description) errors.description = "Description is required";
                if (formData.startDates.length === 0 || formData.startDates.some((date) => !date)) {
                    errors.startDates = "At least one start date is required";
                }
                break;
            default:
                break;
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            handleSubmit(e);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <BasicInfoStep formData={formData} handleInputChange={handleInputChange} validationErrors={validationErrors} />;
            case 2:
                return <CampDetailsStep formData={formData} handleInputChange={handleInputChange} validationErrors={validationErrors} />;
            case 3:
                return <CapacityLocationStep formData={formData} handleInputChange={handleInputChange} validationErrors={validationErrors} />;
            case 4:
                return (
                    <AdditionalInfoStep
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleStartDateChange={handleStartDateChange}
                        addStartDateField={addStartDateField}
                        removeStartDateField={removeStartDateField}
                        validationErrors={validationErrors}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="admin-camp-form">
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
            {renderStepContent()}
            {error && <div className="error-message">{error}</div>}
            <FormActions
                currentStep={currentStep}
                totalSteps={totalSteps}
                handleBack={handleBack}
                handleNext={handleNext}
                handleSubmit={handleFormSubmit}
                closeModal={closeModal}
                editingCamp={editingCamp}
            />
        </form>
    );
};

export default CampForm;
