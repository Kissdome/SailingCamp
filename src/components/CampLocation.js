import React from "react";

const locations = [
    {
        id: 1,
        name: "Weekend Camp Location",
        address: "123 Harbor View Drive",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        coordinates: {
            lat: 37.7749,
            lng: -122.4194,
        },
        description: "Our main sailing center located in the heart of San Francisco Bay",
        facilities: ["Modern sailing equipment", "Classroom facilities", "Changing rooms", "Secure storage"],
    },
    {
        id: 2,
        name: "Week Camp Location",
        address: "456 Marina Way",
        city: "Oakland",
        state: "CA",
        zip: "94607",
        coordinates: {
            lat: 37.8044,
            lng: -122.2712,
        },
        description: "Spacious marina with dedicated training areas",
        facilities: ["Large training fleet", "Indoor classrooms", "Cafeteria", "Equipment maintenance center"],
    },
    {
        id: 3,
        name: "Advanced Camp Location",
        address: "789 Yacht Club Road",
        city: "Sausalito",
        state: "CA",
        zip: "94965",
        coordinates: {
            lat: 37.8591,
            lng: -122.4853,
        },
        description: "Premium sailing facility with access to open waters",
        facilities: ["Racing boats", "Weather station", "Navigation equipment", "Professional training rooms"],
    },
];

function CampLocation() {
    return (
        <div className="locations-section">
            <h2>Camp Locations</h2>
            <div className="locations-grid">
                {locations.map((location) => (
                    <div key={location.id} className="location-card">
                        <h3>{location.name}</h3>
                        <div className="location-details">
                            <p className="address">
                                {location.address}
                                <br />
                                {location.city}, {location.state} {location.zip}
                            </p>
                            <p className="description">{location.description}</p>
                            <div className="facilities">
                                <h4>Facilities:</h4>
                                <ul>
                                    {location.facilities.map((facility, index) => (
                                        <li key={index}>{facility}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="map-container">
                                <iframe
                                    title={`Map for ${location.name}`}
                                    width="100%"
                                    height="200"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${location.coordinates.lat},${location.coordinates.lng}`}
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CampLocation;
