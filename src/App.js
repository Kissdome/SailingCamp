import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import CampRegistrationForm from "./components/CampRegistrationForm/CampRegistrationForm";
import ContactForm from "./components/ContactForm/ContactForm";
import Location from "./components/Location/Location";
import Admin from "./components/Admin";
import "./App.css";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("adminToken");
    };

    return (
        <Router>
            <div className="App">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/register" element={<CampRegistrationForm />} />
                        <Route path="/contact" element={<ContactForm />} />
                        <Route path="/location" element={<Location />} />
                        <Route path="/admin" element={<Admin onLoginSuccess={handleLogin} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
