import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaLock,
    FaEnvelope,
    FaArrowLeft
} from "react-icons/fa";

import api from "../service/api";

import "./ForgotPassword.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!form.email.trim()) {

            setError("Please enter your email.");

            return;
        }

        if (!form.newPassword.trim()) {

            setError("Please enter a new password.");

            return;
        }

        if (!form.confirmPassword.trim()) {

            setError("Please confirm your new password.");

            return;
        }

        if (form.newPassword !== form.confirmPassword) {

            setError("Passwords do not match.");

            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/forgot-password",
                {
                    email: form.email,
                    newPassword: form.newPassword,
                    confirmPassword: form.confirmPassword
                }
            );

            setMessage(response.data);

            setForm({
                email: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

            console.error(error);

            if (error.response) {

                setError(error.response.data);

            } else {

                setError(
                    "Unable to connect to server."
                );

            }

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="forgot-password-page">

            <div className="forgot-password-card">

                <div className="forgot-icon">

                    <FaLock />

                </div>

                <h2>Forgot Password?</h2>

                <p className="forgot-description">

                    Enter your registered email and
                    create a new password.

                </p>

                {message && (

                    <div className="success-message">

                        {message}

                    </div>

                )}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    {/* Email */}

                    <div className="input-box">

                        <FaEnvelope className="input-icon" />

                        <input
                            type="email"
                            name="email"
                            placeholder="Registered Email"
                            value={form.email}
                            onChange={handleChange}
                        />

                    </div>

                    {/* New Password */}

                    <div className="input-box">

                        <FaLock className="input-icon" />

                        <input
                            type="password"
                            name="newPassword"
                            placeholder="New Password"
                            value={form.newPassword}
                            onChange={handleChange}
                        />

                    </div>

                    {/* Confirm Password */}

                    <div className="input-box">

                        <FaLock className="input-icon" />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        type="submit"
                        className="reset-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Updating..."
                            : "Reset Password"}

                    </button>

                </form>

                <button
                    className="back-login-btn"
                    onClick={() => navigate("/login")}
                >

                    <FaArrowLeft />

                    Back to Login

                </button>

            </div>

        </div>
    );
}

export default ForgotPassword;