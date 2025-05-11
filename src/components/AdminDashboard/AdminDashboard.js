import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config";
import ApplicantFilters from "../ApplicantFilters/ApplicantFilters";
import PhotoUpload from "./PhotoUpload";
import "./AdminDashboard.css";

const AdminDashboard = ({ onLogout }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: "registrationDate", direction: "desc" });
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        campType: "",
        experience: "",
        dateRange: {
            start: "",
            end: "",
        },
    });

    useEffect(() => {
        fetchApplicants();
    }, []);

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

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("dateRange.")) {
            const dateField = name.split(".")[1];
            setFilters((prev) => ({
                ...prev,
                dateRange: {
                    ...prev.dateRange,
                    [dateField]: value,
                },
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const clearFilters = () => {
        setFilters({
            campType: "",
            experience: "",
            dateRange: {
                start: "",
                end: "",
            },
        });
    };

    const sortedApplicants = [...applicants].sort((a, b) => {
        if (sortConfig.key === "registrationDate" || sortConfig.key === "startDate") {
            return sortConfig.direction === "asc" ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key]) : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
        }
        return sortConfig.direction === "asc" ? (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1) : a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    const filteredApplicants = sortedApplicants.filter((applicant) => {
        // Text search filter
        const matchesSearch = Object.values(applicant).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()));

        // Camp type filter
        const matchesCampType = !filters.campType || applicant.campType === filters.campType;

        // Experience filter
        const matchesExperience = !filters.experience || applicant.experience === filters.experience;

        // Date range filter
        const startDate = new Date(applicant.startDate);
        const matchesDateRange =
            (!filters.dateRange.start || startDate >= new Date(filters.dateRange.start)) && (!filters.dateRange.end || startDate <= new Date(filters.dateRange.end));

        return matchesSearch && matchesCampType && matchesExperience && matchesDateRange;
    });

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

    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <div className="admin-controls">
                    <input type="text" placeholder="Search applicants..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                    <button onClick={onLogout} className="logout-button">
                        Logout
                    </button>
                    <button onClick={handleDownloadExcel} className="excel-button">
                        Download Excel
                    </button>
                </div>
            </div>

            <PhotoUpload />

            <ApplicantFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />

            <div className="applicants-table-container">
                <h3>Camp Applications</h3>
                {error && <div className="error-message">{error}</div>}
                <div className="table-responsive">
                    <table className="applicants-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("name")}>Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("email")}>Email {sortConfig.key === "email" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("age")}>Age {sortConfig.key === "age" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("experience")}>Experience {sortConfig.key === "experience" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("campType")}>Camp Type {sortConfig.key === "campType" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("startDate")}>Start Date {sortConfig.key === "startDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                                <th onClick={() => handleSort("registrationDate")}>
                                    Registration Date {sortConfig.key === "registrationDate" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                </th>
                                <th>Additional Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplicants.map((applicant) => (
                                <tr key={applicant._id}>
                                    <td>{applicant.name}</td>
                                    <td>{applicant.email}</td>
                                    <td>{applicant.age}</td>
                                    <td>{applicant.experience}</td>
                                    <td>{applicant.campType}</td>
                                    <td>{new Date(applicant.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(applicant.registrationDate).toLocaleDateString()}</td>
                                    <td>{applicant.additionalInfo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredApplicants.length === 0 && <div className="no-results">No applicants found</div>}
            </div>
        </div>
    );
};

export default AdminDashboard;
