import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config";
import "./ApplicantFilters.css";

const ApplicantFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCamps();
    }, []);

    const fetchCamps = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(API_ENDPOINTS.CAMPS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch camps");
            const data = await response.json();
            setCamps(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="filters-section">
            <div className="filter-group">
                <label htmlFor="camp">Camp:</label>
                <select id="camp" name="camp" value={filters.camp || ""} onChange={onFilterChange}>
                    <option value="">All Camps</option>
                    {camps.map((camp) => (
                        <option key={camp._id} value={camp._id}>
                            {camp.name}
                        </option>
                    ))}
                </select>
            </div>

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
