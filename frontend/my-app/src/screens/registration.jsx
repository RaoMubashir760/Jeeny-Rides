import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./write.css"; // Importing write-css for CSS-in-JS styling
const Registration = () => {
    // Styles object with all CSS properties
    const navigate = useNavigate();
    const styles = {
        container: {
            //minHeight: "90vh",
            minWidth: "95vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            overflow: "hidden",
            padding: "1rem",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        },
        form: {
            background: "rgba(15, 23, 42, 0.85)",
            padding: "2.5rem",
            borderRadius: "1.5rem",
            boxShadow: "0 15px 35px rgba(2, 6, 23, 0.5)",
            width: "100%",
            maxWidth: "630px",
            display: "flex",
            flexDirection: "column",
            marginLeft: "20px",
            gap: "0.8rem",
            color: "#f1f5f9",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            position: "relative",
            overflow: "hidden"
        },
        formHeader: {
            textAlign: "center",
            marginBottom: "0.5rem"
        },
        title: {
            fontSize: "2rem",
            fontWeight: "700",
            background: "linear-gradient(to right, #38bdf8, #0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.25rem"
        },
        subtitle: {
            fontSize: "0.9rem",
            color: "#94a3b8",
            fontWeight: "400"
        },
        inputGroup: {
            position: "relative",
            marginBottom: "0.5rem",
            margin: "15px",
        },
        label: {
            display: "block",
            fontWeight: "500",
            fontSize: "0.9rem",
            marginBottom: "0.5rem",
            color: "#e2e8f0"
        },
        input: {
            //padding: "0.85rem -0rem",
            paddingBottom: "1rem",
            paddingTop: "1.5rem",
            paddingLeft: "2.4rem",
            border: "1px solid rgba(71, 85, 105, 0.5)",
            borderRadius: "0.75rem",
            background: "rgba(30, 41, 59, 0.7)",
            color: "#f1f5f9",
            fontSize: "1rem",
            width: "100%",
            transition: "all 0.2s ease",
            boxShadow: "inset 0 1px 2px rgba(2, 6, 23, 0.1)"
        },
        inputFocus: {
            borderColor: "#38bdf8",
            boxShadow: "0 0 0 3px rgba(56, 189, 248, 0.2)",
            outline: "none",
        },
        inputIcon: {
            position: "absolute",
            left: "1rem",
            top: "70%",
            transform: "translateY(-50%)",
            color: "#64748b",
            width: "20px",
            height: "20px"
        },
        button: {
            marginTop: "0.5rem",
            padding: "1rem",
            background: "linear-gradient(to right, #0ea5e9, #0284c7)",
            border: "none",
            borderRadius: "0.75rem",
            color: "#fff",
            fontWeight: "600",
            fontSize: "1.05rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 6px rgba(2, 132, 199, 0.3)"
        },
        buttonHover: {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 10px rgba(2, 132, 199, 0.4)"
        },
        toggle: {
            textAlign: "center",
            marginTop: "0.5rem",
            color: "#38bdf8",
            fontWeight: "500",
            fontSize: "0.95rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s ease"
        },
        toggleHover: {
            color: "#7dd3fc",
            textDecoration: "underline"
        },
        alert: (type) => ({
            backgroundColor: type === "error" ? "rgba(220, 38, 38, 0.15)" : "rgba(22, 163, 74, 0.15)",
            color: type === "error" ? "#f87171" : "#4ade80",
            padding: "0.75rem",
            borderRadius: "0.7rem",
            textAlign: "center",
            fontSize: "0.9rem",
            border: type === "error" ? "1px solid rgba(220, 38, 38, 0.2)" : "1px solid rgba(22, 163, 74, 0.2)",
            backdropFilter: "blur(4px)"
        }),
        showPassword: {
            position: "absolute",
            right: "0rem",
            top: "70%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            fontSize: "0.85rem",
            fontWeight: "500",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.4rem"
        },
        decorator: {
            position: "absolute",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, rgba(56, 189, 248, 0.1), transparent)",
            top: "-100px",
            right: "-100px",
            zIndex: "-1"
        },
        decorator2: {
            position: "absolute",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, rgba(2, 132, 199, 0.1), transparent)",
            bottom: "-80px",
            left: "-80px",
            zIndex: "-1"
        },
        spinner: {
            display: "inline-block",
            width: "1rem",
            height: "1rem",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            borderTopColor: "white",
            animation: "spin 1s linear infinite",
            marginRight: "0.5rem",
            verticalAlign: "middle"
        }
    };

    // State management
    const [form, setForm] = useState({
        name: "",
        password: "",
        confirmPassword: "",
        type: "passenger",
        phone_number: "",
        current_location: ""
    });
    const [login, setLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);
    const [toggleHover, setToggleHover] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    // Input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setMessage({ text: "", type: "" });
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.password || !form.confirmPassword || !form.phone_number) {
            return setMessage({ text: "All fields are required.", type: "error" });
        }
        if (form.password !== form.confirmPassword) {
            return setMessage({ text: "Passwords do not match.", type: "error" });
        }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage({ text: data.message || "Registration failed.", type: "error" });
            } else {
                setMessage({ text: data.message || "Registration successful!", type: "success" });
                setForm({ name: "", password: "", confirmPassword: "", type: "passenger", phone_number: "", current_location: "" });
                navigate("/login");
            }
        } catch (err) {
            setMessage({ text: "Network error.", type: "error" });
        }
        setLoading(false);
    };

    // Input icons
    const icons = {
        name: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.inputIcon}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        ),
        phone: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.inputIcon}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
        ),
        password: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.inputIcon}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
        ),
        location: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.inputIcon}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        )
    };

    return (
        <div style={styles.container}>
            {/* Keyframes animation for spinner */}
            <style>
                {`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Decorative elements */}
                <div style={styles.decorator}></div>
                <div style={styles.decorator2}></div>

                {/* Form header */}
                <div style={styles.formHeader}>
                    <h2 style={styles.title}>Jeeny Rides</h2>
                    <p style={styles.subtitle}>Register for seamless transportation</p>
                </div>

                {/* Alert messages */}
                {message.text && <div style={styles.alert(message.type)}>{message.text}</div>}

                {/* Name field */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Full Name</label>
                    {icons.name}
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            ...(focusedInput === 'name' && styles.inputFocus)
                        }}
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="John Doe"
                    />
                </div>

                {/* Phone field */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number</label>
                    {icons.phone}
                    <input
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            ...(focusedInput === 'phone' && styles.inputFocus)
                        }}
                        onFocus={() => setFocusedInput('phone')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                {/* Password field */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Password</label>
                    {icons.password}
                    <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            ...(focusedInput === 'password' && styles.inputFocus)
                        }}
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        style={styles.showPassword}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                {/* Confirm password field */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Confirm Password</label>
                    {icons.password}
                    <input
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            ...(focusedInput === 'confirmPassword' && styles.inputFocus)
                        }}
                        onFocus={() => setFocusedInput('confirmPassword')}
                        onBlur={() => setFocusedInput(null)}
                        placeholder="••••••••"
                    />
                </div>

                {/* User type selector */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>User Type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        style={{
                            ...styles.input,
                            paddingLeft: "1rem",
                            ...(focusedInput === 'type' && styles.inputFocus)
                        }}
                        onFocus={() => setFocusedInput('type')}
                        onBlur={() => setFocusedInput(null)}
                    >
                        <option value="passenger">Passenger</option>
                        <option value="driver">Driver</option>
                    </select>
                </div>

                {/* Driver location field */}
                {form.type === "driver" && (
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Current Location</label>
                        {icons.location}
                        <input
                            name="current_location"
                            value={form.current_location}
                            onChange={handleChange}
                            style={{
                                ...styles.input,
                                ...(focusedInput === 'location' && styles.inputFocus)
                            }}
                            onFocus={() => setFocusedInput('location')}
                            onBlur={() => setFocusedInput(null)}
                            placeholder="123 Main St, City"
                        />
                    </div>
                )}

                {/* Submit button */}
                <button
                    type="submit"

                    disabled={loading}
                    style={{
                        ...styles.button,
                        ...(buttonHover && styles.buttonHover),
                        opacity: loading ? 0.8 : 1
                    }}
                    onMouseEnter={() => setButtonHover(true)}
                    onMouseLeave={() => setButtonHover(false)}
                >
                    {loading ? (
                        <>
                            <span style={styles.spinner}></span> Registering...
                        </>
                    ) : "Create Account"}
                </button>

                {/* Toggle between login/register */}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    style={{
                        ...styles.toggle,
                        ...(toggleHover && styles.toggleHover)
                    }}
                    onMouseEnter={() => setToggleHover(true)}
                    onMouseLeave={() => setToggleHover(false)}
                >
                    {login ? "Don't have an account? Register" : "Already have an account? Sign In"}
                </button>
            </form>
        </div>
    );
};

export default Registration;