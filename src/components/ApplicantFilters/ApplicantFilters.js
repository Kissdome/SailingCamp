import React from "react";
import "./ApplicantFilters.css";

const ApplicantFilters = ({ filters, onFilterChange, onClearFilters }) => {
    return (
        <div className="filters-section">
            <div className="filter-group">
                <label htmlFor="campType">Camp Type:</label>
                <select id="campType" name="campType" value={filters.campType} onChange={onFilterChange}>
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="walk-in">Walk-in</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="experience">Experience Level:</label>
                <select id="experience" name="experience" value={filters.experience} onChange={onFilterChange}>
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="dateRangeStart">Start Date Range:</label>
                <input type="date" id="dateRangeStart" name="dateRange.start" value={filters.dateRange.start} onChange={onFilterChange} />
            </div>

            <div className="filter-group">
                <label htmlFor="dateRangeEnd">End Date Range:</label>
                <input type="date" id="dateRangeEnd" name="dateRange.end" value={filters.dateRange.end} onChange={onFilterChange} />
            </div>

            <button onClick={onClearFilters} className="clear-filters-button">
                Clear Filters
            </button>
        </div>
    );
};

export default ApplicantFilters;
