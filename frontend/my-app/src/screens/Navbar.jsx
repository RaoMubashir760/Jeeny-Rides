import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./nav_css.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const name = localStorage.getItem('userName');
    const type = localStorage.getItem('userType');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };


    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar">
            <div className="navbar-title">Jeeny by Mubashir</div>

            {name && type && (
                <div className="navbar-profile" ref={dropdownRef}>
                    <div className="profile-icon" onClick={toggleDropdown}>
                        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Profile" />
                    </div>
                    {showDropdown && (
                        <div className="profile-dropdown">
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Role:</strong> {type}</p>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
