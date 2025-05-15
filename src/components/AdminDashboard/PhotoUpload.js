/**
 * PhotoUpload Component
 *
 * This component provides functionality for uploading camp photos in the admin dashboard.
 * Features include:
 * - Image file selection with preview
 * - File type validation
 * - Upload progress indication
 * - Success/error feedback
 * - Secure upload with authentication
 */

import React, { useState } from "react";
import "./PhotoUpload.css";

const PhotoUpload = () => {
    // State management for file upload process
    const [selectedFile, setSelectedFile] = useState(null); // Stores the selected file
    const [preview, setPreview] = useState(null); // Stores the image preview URL
    const [uploading, setUploading] = useState(false); // Upload progress state
    const [error, setError] = useState(null); // Error state for upload failures
    const [success, setSuccess] = useState(false); // Success state for upload completion

    /**
     * Handles file selection from input
     * Validates file type and creates preview
     * @param {Event} event - The file input change event
     */
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith("image/")) {
                setSelectedFile(file);
                setError(null);
                // Create preview using FileReader
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setError("Please select an image file");
                setSelectedFile(null);
                setPreview(null);
            }
        }
    };

    /**
     * Handles the photo upload process
     * Creates FormData and sends to server with authentication
     * Manages upload states and provides feedback
     */
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file first");
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        // Prepare form data for upload
        const formData = new FormData();
        formData.append("photo", selectedFile);

        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch("http://localhost:5001/api/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            setSuccess(true);
            setSelectedFile(null);
            setPreview(null);
            // Reset file input
            document.getElementById("photo-upload").value = "";
        } catch (err) {
            setError(err.message || "Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    // Render the photo upload interface
    return (
        <div className="photo-upload-section">
            <h3>Upload Camp Photos</h3>
            <div className="upload-container">
                {/* File selection area */}
                <div className="upload-area">
                    <input type="file" id="photo-upload" accept="image/*" onChange={handleFileSelect} className="file-input" />
                    <label htmlFor="photo-upload" className="upload-label">
                        {preview ? "Change Photo" : "Select Photo"}
                    </label>
                </div>

                {/* Image preview */}
                {preview && (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="image-preview" />
                    </div>
                )}

                {/* Status messages */}
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Photo uploaded successfully!</div>}

                {/* Upload button */}
                <button onClick={handleUpload} disabled={!selectedFile || uploading} className="upload-button">
                    {uploading ? "Uploading..." : "Upload Photo"}
                </button>
            </div>
        </div>
    );
};

export default PhotoUpload;
