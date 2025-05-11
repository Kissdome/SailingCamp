import React from "react";
import CampRegistrationForm from "./CampRegistrationForm";
import CampList from "./CampList";

function Camps() {
    return (
        <div className="camps-page">
            <div className="camps-content">
                <div className="camps-header">
                    <h1>Sailing Camps</h1>
                    <p>Join our exciting sailing camps and learn the art of sailing!</p>
                </div>

                <CampList />
                <CampRegistrationForm />
            </div>
        </div>
    );
}

export default Camps;
