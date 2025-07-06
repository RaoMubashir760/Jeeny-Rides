import React, { useState, useEffect } from "react";
import axios from "axios";

const DriverDashboard = () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    const [nearestRides, setNearestRides] = useState([]);
    const [currentRide, setCurrentRide] = useState(null);
    const [message, setMessage] = useState("");

    const styles = {
        container: {
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#f1f5f9",
            padding: "2rem",
            fontFamily: "'Inter', sans-serif",
        },
        card: {
            background: "rgba(15, 23, 42, 0.85)",
            borderRadius: "1rem",
            padding: "2rem",
            maxWidth: "700px",
            width: "100%",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        },
        section: { marginBottom: "2rem" },
        button: {
            padding: "0.6rem 1rem",
            margin: "0.5rem 0",
            background: "#0284c7",
            border: "none",
            borderRadius: "0.5rem",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
        },
        rideBox: {
            background: "#1e293b",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
        }
    };

    const fetchNearestRides = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/nearest-rides/${userId}`);
            setNearestRides(res.data);
            console.log("DATA jo arha ha ", userId);
        } catch (err) {
            setMessage("Error fetching nearest rides.");
        }
    };

    const acceptRide = async (rideId) => {
        try {
            const res = await axios.post("http://localhost:8000/accept-ride", {
                ride_id: rideId,
                driver_id: userId,
            });
            setMessage(res.data.message);
            fetchCurrentRide();
            fetchNearestRides();
        } catch (err) {
            setMessage("Error accepting ride.");
        }
    };

    const fetchCurrentRide = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/current-ride/${userId}`);
            setCurrentRide(res.data);
        } catch (err) {
            setCurrentRide(null);
        }
    };

    const completeRide = async () => {
        try {
            const res = await axios.post("http://localhost:8000/complete-ride", {
                ride_id: currentRide.id,
                driver_id: userId,
            });
            setMessage(res.data.message);
            setCurrentRide(null);
            fetchNearestRides();
        } catch (err) {
            setMessage("Error completing ride.");
        }
    };

    useEffect(() => {
        fetchNearestRides();
        fetchCurrentRide();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Welcome, {userName} (Driver)</h2>
                {message && <p>{message}</p>}

                {/* Current Ride */}
                <div style={styles.section}>
                    <h3>Current Ride</h3>
                    {currentRide ? (
                        <div style={styles.rideBox}>
                            <p><strong>Pickup:</strong> {currentRide.pickup_location}</p>
                            <p><strong>Drop:</strong> {currentRide.drop_location}</p>
                            <p><strong>Status:</strong> {currentRide.status}</p>
                            <button onClick={completeRide} style={styles.button}>Complete Ride</button>
                        </div>
                    ) : (
                        <p>No current ride assigned.</p>
                    )}
                </div>

                {/* Nearest Pending Rides */}
                <div style={styles.section}>
                    <h3>Nearest Pending Rides</h3>
                    {nearestRides.length > 0 ? (
                        nearestRides.map((ride, idx) => (
                            <div key={idx} style={styles.rideBox}>
                                <p><strong>Pickup:</strong> {ride.pickup_location}</p>
                                <p><strong>Drop:</strong> {ride.drop_location}</p>
                                <p><strong>Distance:</strong> {ride.distance} km</p>
                                <button onClick={() => acceptRide(ride.id)} style={styles.button}>Accept Ride</button>
                            </div>
                        ))
                    ) : (
                        <p>No pending rides available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
