import React from "react";
import "./CampForm.css";

const CampForm = ({ formData, handleInputChange, handleStartDateChange, addStartDateField, removeStartDateField, handleSubmit, closeModal, editingCamp, error }) => {
    return (
        <form onSubmit={handleSubmit} className="camp-form">
            <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="name" className="required-field">
                            Camp Name
                        </label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type" className="required-field">
                            Camp Type
                        </label>
                        <select id="type" name="type" value={formData.type} onChange={handleInputChange} required>
                            <option value="residential">Residential</option>
                            <option value="day">Day Camp</option>
                            <option value="weekend">Weekend Camp</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4>Camp Details</h4>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="duration" className="required-field">
                            Duration
                        </label>
                        <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 1 week, 2 weeks" required />
                        <span className="help-text">Specify the duration of the camp</span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price" className="required-field">
                            Price
                        </label>
                        <input type="text" id="price" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., $500" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ageRange" className="required-field">
                            Age Range
                        </label>
                        <input type="text" id="ageRange" name="ageRange" value={formData.ageRange} onChange={handleInputChange} placeholder="e.g., 8-12 years" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="experience" className="required-field">
                            Experience Level
                        </label>
                        <select id="experience" name="experience" value={formData.experience} onChange={handleInputChange} required>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4>Capacity & Location</h4>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="maxCapacity" className="required-field">
                            Maximum Capacity
                        </label>
                        <input type="number" id="maxCapacity" name="maxCapacity" value={formData.maxCapacity} onChange={handleInputChange} min="1" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="instructorCount" className="required-field">
                            Number of Instructors
                        </label>
                        <input type="number" id="instructorCount" name="instructorCount" value={formData.instructorCount} onChange={handleInputChange} min="1" required />
                    </div>
                    <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label htmlFor="location" className="required-field">
                            Location
                        </label>
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required />
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h4>Start Dates</h4>
                {formData.startDates.map((date, index) => (
                    <div key={index} className="date-input-group">
                        <input type="date" className="start-date-input" value={date} onChange={(e) => handleStartDateChange(index, e.target.value)} required />
                        {formData.startDates.length > 1 && (
                            <button type="button" className="remove-date-button" onClick={() => removeStartDateField(index)}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" className="add-date-button" onClick={addStartDateField}>
                    Add Another Start Date
                </button>
            </div>

            <div className="form-section">
                <h4>Additional Information</h4>
                <div className="form-group">
                    <label htmlFor="description" className="required-field">
                        Description
                    </label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
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
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <button type="submit" className="submit-button">
                    {editingCamp ? "Update Camp" : "Create Camp"}
                </button>
                <button type="button" className="cancel-button" onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CampForm;
