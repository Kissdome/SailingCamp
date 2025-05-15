import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

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

            // Adjust if at the start
            if (currentPage <= 2) {
                end = 4;
            }
            // Adjust if at the end
            if (currentPage >= totalPages - 1) {
                start = totalPages - 3;
            }

            // Add ellipsis if needed
            if (start > 2) {
                pages.push("...");
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="pagination">
            <button className="pagination-button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>

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

            <button className="pagination-button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
