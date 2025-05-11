import React from "react";
import "./Location.css";

function Location() {
    const location = {
        name: "Sailing Center",
        address: "123 Harbor View Drive",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
        coordinates: {
            lat: 37.7749,
            lng: -122.4194,
        },
        description: "Our main sailing center located in the heart of San Francisco Bay, offering state-of-the-art facilities and direct access to the bay waters.",
        facilities: [
            "Modern sailing equipment",
            "Classroom facilities",
            "Changing rooms",
            "Secure storage",
            "Weather station",
            "Navigation equipment",
            "Professional training rooms",
        ],
        hours: {
            weekday: "9:00 AM - 6:00 PM",
            weekend: "8:00 AM - 8:00 PM",
        },
    };

    return (
        <div className="location-section">
            <h2>Our Location</h2>
            <div className="location-container">
                <div className="location-info">
                    <h3>{location.name}</h3>
                    <p className="address">
                        {location.address}
                        <br />
                        {location.city}, {location.state} {location.zip}
                    </p>
                    <p className="description">{location.description}</p>

                    <div className="hours">
                        <h4>Operating Hours</h4>
                        <p>Weekdays: {location.hours.weekday}</p>
                        <p>Weekends: {location.hours.weekend}</p>
                    </div>

                    <div className="facilities">
                        <h4>Our Facilities</h4>
                        <ul>
                            {location.facilities.map((facility, index) => (
                                <li key={index}>{facility}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="map-container">
                    <iframe
                        title="Sailing Center Location"
                        width="100%"
                        height="400"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${location.coordinates.lat},${location.coordinates.lng}`}
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}

export default Location;
