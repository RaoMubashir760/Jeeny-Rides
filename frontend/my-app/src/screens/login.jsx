import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./write.css"; // If you want to keep your global styles

const styles = {
    container: {
        minWidth: "100vw",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
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
        maxWidth: "430px",
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

const Login = () => {
    const [form, setForm] = useState({
        phone_number: "",
        password: ""
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setMessage({ text: "", type: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.phone_number || !form.password) {
            return setMessage({ text: "Phone number and password are required.", type: "error" });
        }
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            console.log(data);
            if (!res.ok) {
                setMessage({ text: data.message || "Login failed.", type: "error" });
            } else {
                setMessage({ text: data.message || "Login successful!", type: "success" });
                localStorage.setItem("token", data.token);
                localStorage.setItem("userType", data.type);
                localStorage.setItem("userName", data.name);
                localStorage.setItem("userId", data.id);
                if (data.type === "driver") {
                    navigate("/driver-dashboard");
                } else {
                    navigate("/passenger-dashboard");
                }
            }
        } catch (err) {
            setMessage({ text: "Network error.", type: "error" });
        }
        setLoading(false);
    };

    const icons = {
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
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.decorator}></div>
                <div style={styles.decorator2}></div>
                <div style={styles.formHeader}>
                    <h2 style={styles.title}>Jeeny Rides</h2>
                    <p style={styles.subtitle}>Sign in to your account</p>
                </div>
                {message.text && <div style={styles.alert(message.type)}>{message.text}</div>}
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
                            <span style={styles.spinner}></span> Logging in...
                        </>
                    ) : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;