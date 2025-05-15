/**
 * AdminDashboard Component
 *
 * This is the main administrative interface for managing camp applications, instructors, and camps.
 * It provides functionality for viewing, filtering, sorting, and managing applicant data.
 */

import React, { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../config";
import ApplicantFilters from "../ApplicantFilters/ApplicantFilters";
import PhotoUpload from "./PhotoUpload";
import AdminNav from "./AdminNav";
import CampManagement from "./CampManagement";
import InstructorManagement from "../Admin/InstructorManagement";
import AddApplicant from "./AddApplicant";
import Pagination from "./Pagination";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
    // State management for different sections and data
    const [activeSection, setActiveSection] = useState("applications"); // Controls which section is currently displayed
    const [applicants, setApplicants] = useState([]); // Stores all applicant data
    const [loading, setLoading] = useState(true); // Loading state indicator
    const [error, setError] = useState(null); // Error state for handling API errors
    const [sortConfig, setSortConfig] = useState({ key: "registrationDate", direction: "desc" }); // Sorting configuration
    const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering applicants
    const [filters, setFilters] = useState({
        // Filter states for different criteria
        campType: "",
        experience: "",
        camp: "",
    });
    const [camps, setCamps] = useState({}); // Stores camp data mapped by ID
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const itemsPerPage = 10; // Number of items to display per page

    // Fetch initial data on component mount
    useEffect(() => {
        fetchApplicants();
        fetchCamps();
    }, []);

    /**
     * Fetches all applicant data from the API
     * Includes authentication token in the request
     */
    const fetchApplicants = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(API_ENDPOINTS.APPLICANTS, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch applicants");
            const data = await response.json();
            setApplicants(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    /**
     * Fetches camp data and organizes it into a map for easy lookup
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
            const campsMap = data.reduce((acc, camp) => {
                acc[camp._id] = camp;
                return acc;
            }, {});
            setCamps(campsMap);
        } catch (err) {
            console.error("Error fetching camps:", err);
        }
    };

    /**
     * Handles sorting of applicant data
     * @param {string} key - The field to sort by
     */
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    /**
     * Updates filter state when filter inputs change
     * @param {Event} e - The change event from the filter input
     */
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Resets all filters to their default empty state
     */
    const clearFilters = () => {
        setFilters({
            campType: "",
            experience: "",
            camp: "",
        });
    };

    /**
     * Adds a new applicant to the list
     * @param {Object} newApplicant - The new applicant data
     */
    const handleApplicantAdded = (newApplicant) => {
        setApplicants((prevApplicants) => [newApplicant, ...prevApplicants]);
    };

    /**
     * Handles page changes in pagination
     * @param {number} page - The new page number
     */
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Sort applicants based on current sort configuration
    const sortedApplicants = [...applicants].sort((a, b) => {
        if (sortConfig.key === "registrationDate" || sortConfig.key === "startDate") {
            return sortConfig.direction === "asc" ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key]) : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
        }
        return sortConfig.direction === "asc" ? (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1) : a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    // Filter applicants based on search term and filters
    const filteredApplicants = sortedApplicants.filter((applicant) => {
        const matchesSearch = Object.values(applicant).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCampType = !filters.campType || applicant.campType === filters.campType;
        const matchesExperience = !filters.experience || applicant.experience === filters.experience;
        const matchesCamp = !filters.camp || applicant.camp === filters.camp;

        return matchesSearch && matchesCampType && matchesExperience && matchesCamp;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedApplicants = filteredApplicants.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when filters or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchTerm]);

    /**
     * Downloads applicant data as an Excel file
     */
    const handleDownloadExcel = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(API_ENDPOINTS.APPLICANTS + "/excel", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download Excel file");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "applicants.xlsx";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading Excel file:", err);
            alert("Failed to download Excel file. Please try again.");
        }
    };

    /**
     * Handles applicant approval/rejection
     * @param {string} applicantId - The ID of the applicant
     * @param {string} status - The new status ('approved' or 'rejected')
     */
    const handleApproval = async (applicantId, status) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`${API_ENDPOINTS.APPLICANTS}/${applicantId}/approve`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) throw new Error("Failed to update applicant status");

            // Update the local state
            setApplicants((prevApplicants) => prevApplicants.map((applicant) => (applicant._id === applicantId ? { ...applicant, status } : applicant)));
        } catch (err) {
            console.error("Error updating applicant status:", err);
            alert("Failed to update applicant status. Please try again.");
        }
    };

    /**
     * Renders the appropriate section based on activeSection state
     * @returns {JSX.Element} The rendered section component
     */
    const renderSection = () => {
        switch (activeSection) {
            case "applications":
                return (
                    <>
                        <div className="applications-header">
                            <h2>Camp Applications</h2>
                            <div className="applications-controls">
                                <input
                                    type="text"
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                <ApplicantFilters filters={filters} onFilterChange={handleFilterChange} camps={camps} />
                            </div>
                        </div>
                        <div className="applications-table-container">
                            <table className="applications-table">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort("name")}>Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                        <th onClick={() => handleSort("email")}>Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                        <th onClick={() => handleSort("age")}>Age {sortConfig.key === "age" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                        <th onClick={() => handleSort("experience")}>
                                            Experience {sortConfig.key === "experience" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                        </th>
                                        <th onClick={() => handleSort("campType")}>Camp Type {sortConfig.key === "campType" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                        <th onClick={() => handleSort("startDate")}>Start Date {sortConfig.key === "startDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                        <th onClick={() => handleSort("status")}>Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                        <th>Actions</th>
                                        <th>Additional Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedApplicants.map((applicant) => (
                                        <tr key={applicant._id} className={`status-${applicant.status}`}>
                                            <td>{applicant.name}</td>
                                            <td>{applicant.email}</td>
                                            <td>{applicant.age}</td>
                                            <td>{applicant.experience}</td>
                                            <td>{applicant.campType}</td>
                                            <td>{new Date(applicant.startDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-badge ${applicant.status}`}>{applicant.status}</span>
                                            </td>
                                            <td>
                                                {applicant.status === "pending" && (
                                                    <div className="approval-actions">
                                                        <button className="approve-button" onClick={() => handleApproval(applicant._id, "approved")}>
                                                            Approve
                                                        </button>
                                                        <button className="reject-button" onClick={() => handleApproval(applicant._id, "rejected")}>
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td>{applicant.additionalInfo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredApplicants.length === 0 && <div className="no-results">No applicants found</div>}
                        {filteredApplicants.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
                    </>
                );
            case "add-applicant":
                return <AddApplicant onApplicantAdded={handleApplicantAdded} />;
            case "photos":
                return <PhotoUpload />;
            case "camps":
                return <CampManagement />;
            case "instructors":
                return <InstructorManagement />;
            case "reports":
                return <div className="section-content">Reports Section - Coming Soon</div>;
            case "settings":
                return <div className="section-content">Settings Section - Coming Soon</div>;
            default:
                return null;
        }
    };

    // Show loading state while data is being fetched
    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    // Main component render
    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <div className="admin-controls">
                    {activeSection === "applications" && (
                        <button onClick={handleDownloadExcel} className="excel-button">
                            Download Excel
                        </button>
                    )}
                    <button onClick={onLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>

            <AdminNav activeSection={activeSection} onSectionChange={setActiveSection} />

            {renderSection()}
        </div>
    );
};

export default AdminDashboard;
