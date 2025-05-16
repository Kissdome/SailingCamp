/**
 * ApplicantFilters Component
 *
 * This component provides filtering functionality for the applicant list in the admin dashboard.
 * It allows filtering by camp, camp type, and experience level.
 * The component fetches camp data from the API and provides a user interface for applying filters.
 */

import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config";
import "./ApplicantFilters.css";

const ApplicantFilters = ({ filters, onFilterChange, onClearFilters }) => {
    // State for managing camp data and component status
    const [camps, setCamps] = useState([]); // Stores the list of available camps
    const [loading, setLoading] = useState(true); // Loading state while fetching camps
    const [error, setError] = useState(null); // Error state for API errors

    // Fetch camps data when component mounts
    useEffect(() => {
        fetchCamps();
    }, []);

    /**
     * Fetches camp data from the API
     * Includes authentication token in the request
     * Updates the camps state with the fetched data
     */
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

    // Render the filters section
    return (
        <div className="filters-section">
            {/* Camp filter dropdown */}
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

            {/* Camp type filter dropdown */}
            <div className="filter-group">
                <label htmlFor="campType">Camp Type:</label>
                <select id="campType" name="campType" value={filters.campType} onChange={onFilterChange}>
                    <option value="">All Types</option>
                    <option value="residential">Residential</option>
                    <option value="walk-in">Walk-in</option>
                </select>
            </div>

            {/* Experience level filter dropdown */}
            <div className="filter-group">
                <label htmlFor="experience">Experience Level:</label>
                <select id="experience" name="experience" value={filters.experience} onChange={onFilterChange}>
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            {/* Status filter dropdown */}
            <div className="filter-group">
                <label htmlFor="status">Status:</label>
                <select id="status" name="status" value={filters.status} onChange={onFilterChange}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Clear filters button */}
            <button onClick={onClearFilters} className="clear-filters-button">
                Clear Filters
            </button>
        </div>
    );
};

export default ApplicantFilters;
