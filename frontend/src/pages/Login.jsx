import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserCircle
} from "react-icons/fa";
import api from "../service/api";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
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

  const loginUser = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post("/auth/login", {

        email: form.email,
        password: form.password

      });

      console.log("Response:", response.data);
      console.log("User ID:", response.data.userId);
      console.log("Full Name:", response.data.fullName);
      console.log("Personal ID:", response.data.personalId);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "userId",
        response.data.userId
      );

      localStorage.setItem(
        "fullName",
        response.data.fullName
      );

      /*
       * Save personalId only if
       * backend returned one.
       */
      if (response.data.personalId) {

        localStorage.setItem(
          "personalId",
          response.data.personalId
        );

      }

      navigate("/dashboard", { replace: true });

    } catch (error) {

      console.error(error);

      if (error.response) {

        alert(
          error.response.data.message ||
          "Invalid Email or Password"
        );

      } else {

        alert(
          "Unable to connect to the server."
        );

      }

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        {/* Header */}

        <div className="text-center">

          <FaUserCircle
            className="login-icon"
          />

          <h2 className="login-title">

            Welcome Back

          </h2>

          <p className="login-subtitle">

            Login to continue building your resume.

          </p>

        </div>


        {/* Login Form */}

        <form onSubmit={loginUser}>

          {/* Email */}

          <div className="input-box">

            <FaEnvelope
              className="input-icon"
            />

            <input

              type="email"

              name="email"

              placeholder="Email Address"

              value={form.email}

              onChange={handleChange}

              required

            />

          </div>


          {/* Password */}

          <div className="input-box">

            <FaLock
              className="input-icon"
            />

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
                : <FaEye />
              }

            </span>

          </div>


          {/* Remember + Forgot */}

          <div className="login-options">

            <label className="remember">

              <input

                type="checkbox"

                checked={rememberMe}

                onChange={() =>
                  setRememberMe(!rememberMe)
                }

              />

              Remember Me

            </label>


            <Link
              to="/forgot-password"
              className="forgot-link"
            >

              Forgot Password?

            </Link>

          </div>


          {/* Login Button */}

          <button
            type="submit"
            className="login-btn"
          >

            Login

          </button>

        </form>


        {/* Register */}

        <div className="register-section">

          <p>

            Don't have an account?

          </p>

          <Link
            to="/register"
            className="register-link"
          >

            Create Account

          </Link>

        </div>

      </div>

    </div>

  );

}

export default Login;