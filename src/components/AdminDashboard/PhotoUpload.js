import React, { useState } from "react";
import "./PhotoUpload.css";

const PhotoUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith("image/")) {
                setSelectedFile(file);
                setError(null);
                // Create preview
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

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file first");
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

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

    return (
        <div className="photo-upload-section">
            <h3>Upload Camp Photos</h3>
            <div className="upload-container">
                <div className="upload-area">
                    <input type="file" id="photo-upload" accept="image/*" onChange={handleFileSelect} className="file-input" />
                    <label htmlFor="photo-upload" className="upload-label">
                        {preview ? "Change Photo" : "Select Photo"}
                    </label>
                </div>

                {preview && (
                    <div className="preview-container">
                        <img src={preview} alt="Preview" className="image-preview" />
                    </div>
                )}

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Photo uploaded successfully!</div>}

                <button onClick={handleUpload} disabled={!selectedFile || uploading} className="upload-button">
                    {uploading ? "Uploading..." : "Upload Photo"}
                </button>
            </div>
        </div>
    );
};

export default PhotoUpload;
