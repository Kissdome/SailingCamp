/**
 * Pagination Component
 *
 * A reusable pagination component that displays page numbers and navigation controls.
 * It handles complex pagination logic including ellipsis for large page ranges.
 * The component is designed to show a maximum of 5 page numbers at a time,
 * with ellipsis (...) for skipped page ranges.
 */

import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    /**
     * Generates an array of page numbers to display
     * Includes logic for handling ellipsis and page range calculations
     * @returns {Array} Array of page numbers and ellipsis to display
     */
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Maximum number of page buttons to show

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of visible pages
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if at the start of the range
            if (currentPage <= 2) {
                end = 4;
            }
            // Adjust if at the end of the range
            if (currentPage >= totalPages - 1) {
                start = totalPages - 3;
            }

            // Add ellipsis if there's a gap after the first page
            if (start > 2) {
                pages.push("...");
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis if there's a gap before the last page
            if (end < totalPages - 1) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    // Render the pagination controls
    return (
        <div className="pagination">
            {/* Previous page button */}
            <button className="pagination-button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>

            {/* Page numbers */}
            <div className="page-numbers">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        className={`page-number ${page === currentPage ? "active" : ""} ${page === "..." ? "ellipsis" : ""}`}
                        onClick={() => typeof page === "number" && onPageChange(page)}
                        disabled={page === "..."}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next page button */}
            <button className="pagination-button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
