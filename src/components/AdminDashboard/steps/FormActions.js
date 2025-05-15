import React from "react";
import PropTypes from "prop-types";
import "../CampForm.css";

const FormActions = ({ currentStep, totalSteps, handleBack, handleNext, handleSubmit, closeModal, editingCamp }) => {
    return (
        <div className="form-actions">
            {currentStep > 1 && (
                <button type="button" className="back-button" onClick={handleBack}>
                    Back
                </button>
            )}
            {currentStep < totalSteps ? (
                <button type="button" className="next-button" onClick={handleNext}>
                    Next
                </button>
            ) : (
                <button type="submit" className="submit-button" onClick={handleSubmit}>
                    {editingCamp ? "Update Camp" : "Create Camp"}
                </button>
            )}
            <button type="button" className="cancel-button" onClick={closeModal}>
                Cancel
            </button>
        </div>
    );
};

FormActions.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    editingCamp: PropTypes.object,
};

FormActions.defaultProps = {
    editingCamp: null,
};

export default FormActions;
