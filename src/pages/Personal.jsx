import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub
} from "react-icons/fa";

import api from "../service/api";
import "./Personal.css";

function Personal() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    objective: ""
  });

  const [loading, setLoading] = useState(false);

  /*
   * =====================================================
   * LOAD EXISTING RESUME ONLY WHEN EDITING
   * =====================================================
   */

  useEffect(() => {

    const editPersonalId =
      localStorage.getItem("personalId");

    /*
     * No personalId means CREATE NEW RESUME.
     * Therefore do not load old resume information.
     */

    if (!editPersonalId) {
      return;
    }

    api.get(`/personal/${editPersonalId}`)
      .then((res) => {

        const data = res.data;

        setForm({

          fullName:
            `${data.firstName || ""} ${data.lastName || ""}`.trim(),

          email: data.email || "",

          phone: data.phone || "",

          address: data.address || "",

          linkedin: data.linkedin || "",

          github: data.github || "",

          objective: data.summary || ""

        });

      })
      .catch((error) => {

        console.error(
          "Failed to load personal details:",
          error
        );

      });

  }, []);

  /*
   * =====================================================
   * HANDLE INPUT
   * =====================================================
   */

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  /*
   * =====================================================
   * SAVE PERSONAL
   * =====================================================
   */

  const savePersonal = async () => {

    setLoading(true);

    try {

      /*
       * Split full name
       */

      const nameParts =
        form.fullName.trim().split(/\s+/);

      const firstName =
        nameParts[0] || "";

      const lastName =
        nameParts.length > 1
          ? nameParts.slice(1).join(" ")
          : "";

      /*
       * Logged-in user
       */

      const userId =
        localStorage.getItem("userId");

      if (!userId) {

        alert(
          "User information not found. Please login again."
        );

        navigate("/login");

        return;

      }

      /*
       * Personal data
       */

      const personalData = {

        firstName: firstName,

        lastName: lastName,

        email: form.email,

        phone: form.phone,

        address: form.address,

        city: "",

        state: "",

        country: "",

        pincode: "",

        jobTitle: "",

        linkedin: form.linkedin,

        github: form.github,

        summary: form.objective,

        user: {
          id: Number(userId)
        }

      };

      /*
       * Check whether we are editing
       */

      const editPersonalId =
        localStorage.getItem("personalId");

      let response;

      /*
       * =================================================
       * EDIT EXISTING RESUME
       * =================================================
       */

      if (editPersonalId) {

        console.log(
          "EDITING RESUME:",
          editPersonalId
        );

        response = await api.put(

          `/personal/${editPersonalId}`,

          personalData

        );

      }

      /*
       * =================================================
       * CREATE NEW RESUME
       * =================================================
       */

      else {

        console.log(
          "CREATING NEW RESUME"
        );

        response = await api.post(

          "/personal",

          personalData

        );

      }

      /*
       * =================================================
       * SAVE NEW/UPDATED PERSONAL ID
       * =================================================
       */

      localStorage.setItem(

        "personalId",

        response.data.id

      );

      /*
       * Save frontend copy
       */

      localStorage.setItem(

        "personal",

        JSON.stringify(form)

      );

      /*
       * Go to Education
       */

      navigate("/education");

    }

    catch (error) {

      console.error(
        "Failed to save personal details:",
        error
      );

      if (error.response) {

        console.error(
          "Backend response:",
          error.response.data
        );

      }

      alert(
        "Failed to save personal information."
      );

    }

    finally {

      setLoading(false);

    }

  };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (

    <div className="personal-page">

      <div className="personal-card">

        <h2>
          Personal Information
        </h2>

        <p>
          Step 1 of 8
        </p>

        <div className="progress mb-4">

          <div
            className="progress-bar bg-primary"
            style={{
              width: "12.5%"
            }}
          />

        </div>

        <form>

          {/* Full Name */}

          <div className="input-box">

            <FaUser className="input-icon"/>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />

          </div>

          {/* Email */}

          <div className="input-box">

            <FaEnvelope className="input-icon"/>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Phone */}

          <div className="input-box">

            <FaPhone className="input-icon"/>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

          </div>

          {/* Address */}

          <div className="input-box">

            <FaMapMarkerAlt className="input-icon"/>

            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />

          </div>

          {/* LinkedIn */}

          <div className="input-box">

            <FaLinkedin className="input-icon"/>

            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn Profile"
              value={form.linkedin}
              onChange={handleChange}
            />

          </div>

          {/* GitHub */}

          <div className="input-box">

            <FaGithub className="input-icon"/>

            <input
              type="text"
              name="github"
              placeholder="GitHub Profile"
              value={form.github}
              onChange={handleChange}
            />

          </div>

          {/* Objective */}

          <div className="input-box">

            <textarea
              rows="5"
              name="objective"
              placeholder="Career Objective"
              value={form.objective}
              onChange={handleChange}
            />

          </div>

          {/* Buttons */}

          <div className="button-group">

            <button
              type="button"
              className="btn btn-secondary back-btn"
              onClick={() =>
                navigate("/dashboard")
              }
              disabled={loading}
            >

              Back

            </button>

            <button
              type="button"
              className="btn btn-primary next-btn"
              disabled={loading}
              onClick={() => {

                if (
                  form.fullName.trim() === "" ||
                  form.email.trim() === ""
                ) {

                  alert(
                    "Full Name and Email are required."
                  );

                  return;

                }

                const emailRegex =
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (
                  !emailRegex.test(form.email)
                ) {

                  alert(
                    "Please enter a valid email address."
                  );

                  return;

                }

                if (
                  form.phone &&
                  !/^[0-9]{10}$/.test(form.phone)
                ) {

                  alert(
                    "Phone number must be 10 digits."
                  );

                  return;

                }

                savePersonal();

              }}
            >

              {loading
                ? "Saving..."
                : "Save & Next"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default Personal;