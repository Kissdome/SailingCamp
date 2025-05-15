import React, { useState } from "react";
import PropTypes from "prop-types";

const Gallery = ({ images: initialImages }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const images = initialImages || [
        {
            url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0",
            title: "Sailing at Sunset",
        },
        {
            url: "https://images.unsplash.com/photo-1540946485063-a40da27545f8",
            title: "Ocean Adventure",
        },
        {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            title: "Tropical Waters",
        },
        {
            url: "https://images.unsplash.com/photo-1512034400317-de97d7d81454",
            title: "Sailing Yacht",
        },
        {
            url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f",
            title: "Harbor View",
        },
        {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            title: "Blue Waters",
        },
    ];

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="gallery">
            <div className="gallery-grid">
                {images.map((image, index) => (
                    <div key={index} className="gallery-item" onClick={() => handleImageClick(image)}>
                        <img src={image.url} alt={image.title} />
                        <div className="image-overlay">
                            <h3>{image.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={handleCloseModal}>
                            ×
                        </button>
                        <img src={selectedImage.url} alt={selectedImage.title} />
                        <h3>{selectedImage.title}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};

Gallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            url: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        })
    ),
};

export default Gallery;
