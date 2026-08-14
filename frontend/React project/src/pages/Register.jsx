import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus
} from "react-icons/fa";
import "./Register.css";
import api from "../service/api";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const togglePassword = () => {

    setShowPassword(!showPassword);

  };

  const toggleConfirmPassword = () => {

    setShowConfirmPassword(!showConfirmPassword);

  };

  const getPasswordStrength = () => {

    if (form.password.length === 0) return "";

    if (form.password.length < 6) return "Weak";

    if (form.password.length < 10) return "Medium";

    return "Strong";

  };

  return (

    <div className="register-page">

      <div className="register-card">

        <div className="text-center">

          <FaUserPlus className="register-icon" />

          <h2 className="register-title">

            Create Account

          </h2>

          <p className="register-subtitle">

            Register to save and manage multiple resumes.

          </p>

        </div>

        <form>

          <div className="input-box">

            <FaUser className="input-icon" />

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-box">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-box">

            <FaPhone className="input-icon" />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <span
              className="eye"
              onClick={togglePassword}
            >

              {showPassword
                ? <FaEyeSlash />
                : <FaEye />}

            </span>

          </div>

          <small className={`strength ${getPasswordStrength().toLowerCase()}`}>

            {getPasswordStrength() &&
              `Password Strength: ${getPasswordStrength()}`}

          </small>

          <div className="input-box">

            <FaLock className="input-icon" />

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />

            <span
              className="eye"
              onClick={toggleConfirmPassword}
            >

              {showConfirmPassword
                ? <FaEyeSlash />
                : <FaEye />}

            </span>

          </div>
          <div className="terms-box">

            <input
              type="checkbox"
              id="terms"
              required
            />

            <label htmlFor="terms">
              I agree to the Terms & Conditions
            </label>

          </div>

          <button
            type="button"
            className="register-btn"
            onClick={async () => {

  if (
    form.fullName === "" ||
    form.email === "" ||
    form.phone === "" ||
    form.password === "" ||
    form.confirmPassword === ""
  ) {
    alert("Please fill all fields");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {

    await api.post("/auth/register", {

      fullName: form.fullName,

      email: form.email,

      phone: form.phone,

      password: form.password

    });

    alert("Registration Successful");

    navigate("/login");

  } catch (error) {

    console.error(error);

    if (error.response) {

      alert(error.response.data.message || "Registration Failed");

    } else {

      alert("Server not responding");

    }

  }

}}
          >
            Create Account
          </button>

        </form>

        <div className="login-section">

          <p>

            Already have an account?

          </p>

          <Link
            to="/login"
            className="login-link"
          >
            Login Here
          </Link>

        </div>

      </div>

    </div>

  );

}

export default Register;