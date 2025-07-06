import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PassengerDashboard = () => {
    const navigate = useNavigate();
    //const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    console.log("User Type:", userType);
    console.log("User Name:", userName);
    console.log("User ID:", userId);
    const [form, setForm] = useState({
        passenger_id: userId, // Replace with dynamic user ID in production
        pickup_location: "",
        drop_location: "",
        ride_type: "standard",
    });
    const [status, setStatus] = useState([]);
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState("");

    const styles = {
        container: {
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            fontFamily: "'Inter', sans-serif",
            color: "#f1f5f9",
            padding: "1rem",
        },
        card: {
            background: "rgba(15, 23, 42, 0.85)",
            borderRadius: "1rem",
            padding: "2rem",
            width: "100%",
            maxWidth: "700px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        },
        section: { marginBottom: "2rem" },
        input: {
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #475569",
            background: "rgba(30, 41, 59, 0.7)",
            color: "#f1f5f9",
            marginBottom: "1rem",
        },
        button: {
            width: "100%",
            padding: "0.8rem",
            background: "linear-gradient(to right, #0ea5e9, #0284c7)",
            border: "none",
            borderRadius: "0.75rem",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
        },
        historyItem: {
            borderBottom: "1px solid #334155",
            paddingBottom: "0.5rem",
            marginBottom: "0.5rem",
        },
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const requestRide = async () => {
        try {
            const res = await axios.post("http://localhost:8000/request-ride", form);
            setMessage("Ride requested successfully.");
            fetchStatus();
            fetchHistory();
        } catch (err) {
            setMessage("Failed to request ride.");
        }
    };
    // Fetch current ride status
    const [ride_status, set_ride_status] = useState(0);
    const fetchStatus = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8000/ongoing-ride/" + form.passenger_id,
                { timeout: 30000 } // 30 seconds
            );
            setStatus(res.data.result);
            set_ride_status(res.data.result.length > 0 ? 1 : 0);
            console.log("Current Ride Status:", res.data.result);
        } catch (err) {
            if (err.code === 'ECONNABORTED') {
                console.error("Status fetch request timed out.");
            } else {
                console.error("Status fetch error:", err.message);
            }
            setStatus(null);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8000/history-ride/" + form.passenger_id,
                { timeout: 30000 } // 30 seconds
            );
            setHistory(res.data.result);
            console.log("Ride History:", res.data);
        } catch (err) {
            if (err.code === 'ECONNABORTED') {
                console.error("History fetch request timed out.");
            } else {
                console.error("History fetch error:", err.message);
            }
            setHistory([]);
        }
    };

    useEffect(() => {
        fetchStatus();
        fetchHistory();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>Passenger Dashboard</h2>

                {/* Request a Ride */}
                {ride_status === 0 &&
                    <div style={styles.section}>
                        <h3>Request a Ride</h3>
                        <input
                            name="pickup_location"
                            placeholder="Pickup Location"
                            value={form.pickup_location}
                            onChange={handleChange}
                            style={styles.input}
                        />
                        <input
                            name="drop_location"
                            placeholder="Drop Location"
                            value={form.drop_location}
                            onChange={handleChange}
                            style={styles.input}
                        />
                        <select name="ride_type" value={form.ride_type} onChange={handleChange} style={styles.input}>
                            <option value="standard">Standard</option>
                            <option value="premium">Premium</option>
                        </select>
                        <button onClick={requestRide} style={styles.button}>Request Ride</button>
                        {message && <p>{message}</p>}
                    </div>
                }

                {/* Current Ride Status */}
                <div style={styles.section}>
                    <h3>Current Ride Status</h3>
                    {status ? (
                        <div style={styles.section}>
                            <h3>Ride Info</h3>
                            {status.length > 0 ? (
                                status.map((ride, idx) => (
                                    <div key={idx} style={styles.historyItem}>
                                        <p><strong>Status: </strong> {ride.status}</p>
                                        <p><strong>Pickup_location: </strong> {ride.pickup_location} → <strong>Drop_location: </strong> {ride.drop_location}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No ride history found.</p>
                            )}
                        </div>
                    ) : (
                        <p>No active ride found.</p>
                    )}
                </div>

                {/* Ride History */}
                <div style={styles.section}>
                    <h3>Ride History</h3>
                    {history.length > 0 ? (
                        history.map((ride, idx) => (
                            <div key={idx} style={styles.historyItem}>
                                <p><strong>{ride.ride_type}</strong> - {ride.status}</p>
                                <p>{ride.pickup_location} → {ride.drop_location}</p>
                            </div>
                        ))
                    ) : (
                        <p>No ride history found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PassengerDashboard;
