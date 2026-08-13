import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGraduationCap,
  FaUniversity,
  FaSchool,
  FaCalendarAlt,
  FaPercentage,
  FaPlus,
  FaTrash,
  FaEdit
} from "react-icons/fa";

import api from "../service/api";
import "./Education.css";

function Education() {

  const navigate = useNavigate();

  const personalId = localStorage.getItem("personalId");

  const [educations, setEducations] = useState([]);

  const [form, setForm] = useState({
    degree: "",
    college: "",
    university: "",
    startYear: "",
    endYear: "",
    percentage: ""
  });

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);


  // =====================================================
  // LOAD EDUCATION FROM DATABASE
  // =====================================================

  useEffect(() => {

    if (!personalId) {

      alert(
        "Personal information not found. Please complete Personal Information first."
      );

      navigate("/personal");

      return;
    }

    api.get(`/education/personal/${personalId}`)
      .then((res) => {

        console.log("Education data from backend:", res.data);

        const data = res.data.map((item) => ({

          // DATABASE ID
          id: item.id,

          degree: item.degree || "",

          college: item.college || "",

          university: item.university || "",

          startYear: item.startYear || "",

          endYear: item.endYear || "",

          percentage: item.percentage || ""

        }));

        setEducations(data);

      })
      .catch((error) => {

        console.error(
          "Failed to load education:",
          error
        );

        if (error.response) {

          console.error(
            "Backend status:",
            error.response.status
          );

          console.error(
            "Backend response:",
            error.response.data
          );

        }

      });

  }, [personalId, navigate]);


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };


  // =====================================================
  // ADD / UPDATE EDUCATION ON SCREEN
  // =====================================================

  const addEducation = () => {

    if (
      form.degree.trim() === "" ||
      form.college.trim() === ""
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }


    // UPDATE EXISTING EDUCATION
    if (editId !== null) {

      const updated = educations.map((item) =>

        item.id === editId

          ? {
              ...form,
              id: editId
            }

          : item

      );

      setEducations(updated);

      setEditId(null);

    }


    // ADD NEW EDUCATION
    else {

      setEducations([

        ...educations,

        {
          // IMPORTANT:
          // Temporary frontend ID
          id: `temp-${Date.now()}`,

          ...form

        }

      ]);

    }


    // CLEAR FORM

    setForm({

      degree: "",

      college: "",

      university: "",

      startYear: "",

      endYear: "",

      percentage: ""

    });

  };


  // =====================================================
  // EDIT EDUCATION
  // =====================================================

  const editEducation = (item) => {

    setForm({

      degree: item.degree || "",

      college: item.college || "",

      university: item.university || "",

      startYear: item.startYear || "",

      endYear: item.endYear || "",

      percentage: item.percentage || ""

    });

    setEditId(item.id);

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };


  // =====================================================
  // DELETE EDUCATION
  // =====================================================

  const deleteEducation = async (id) => {

    try {

      /*
       * DATABASE ID = number
       * TEMPORARY ID = string beginning with temp-
       */

      const isDatabaseId =
        typeof id === "number";


      // Delete from backend only
      // if it already exists in database

      if (isDatabaseId) {

        await api.delete(
          `/education/${id}`
        );

      }


      // Remove from frontend

      const updated =
        educations.filter(
          (item) => item.id !== id
        );

      setEducations(updated);


      // If currently editing this item

      if (editId === id) {

        setEditId(null);

        setForm({

          degree: "",

          college: "",

          university: "",

          startYear: "",

          endYear: "",

          percentage: ""

        });

      }

    }

    catch (error) {

      console.error(
        "Failed to delete education:",
        error
      );

      if (error.response) {

        console.error(
          "Backend status:",
          error.response.status
        );

        console.error(
          "Backend response:",
          error.response.data
        );

      }

      alert(
        "Failed to delete education."
      );

    }

  };


  // =====================================================
  // SAVE EDUCATION TO DATABASE
  // =====================================================

  const saveEducation = async () => {

    if (educations.length === 0) {

      alert(
        "Please add at least one education."
      );

      return;
    }


    if (!personalId) {

      alert(
        "Personal information not found."
      );

      navigate("/personal");

      return;
    }


    setLoading(true);


    try {

      const savedEducations = [];


      // =================================================
      // SAVE EACH EDUCATION
      // =================================================

      for (const item of educations) {

        const data = {

          degree: item.degree,

          college: item.college,

          university: item.university,

          startYear: item.startYear,

          endYear: item.endYear,

          percentage: item.percentage,

          personal: {

            id: Number(personalId)

          }

        };


        let response;


        // =================================================
        // EXISTING DATABASE RECORD
        // =================================================

        if (typeof item.id === "number") {

          console.log(
            "Updating education ID:",
            item.id
          );

          response = await api.put(

            `/education/${item.id}`,

            data

          );

        }


        // =================================================
        // NEW FRONTEND RECORD
        // =================================================

        else {

          console.log(
            "Creating new education..."
          );

          response = await api.post(

            "/education",

            data

          );

        }


        console.log(
          "Education API response:",
          response.data
        );


        savedEducations.push(
          response.data
        );

      }


      // =================================================
      // UPDATE SCREEN WITH DATABASE DATA
      // =================================================

      const finalData =
        savedEducations.map((item) => ({

          // This is now the real DATABASE ID

          id: item.id,

          degree: item.degree || "",

          college: item.college || "",

          university: item.university || "",

          startYear: item.startYear || "",

          endYear: item.endYear || "",

          percentage: item.percentage || ""

        }));


      setEducations(finalData);


      // =================================================
      // LOCAL STORAGE BACKUP
      // =================================================

      localStorage.setItem(

        "education",

        JSON.stringify(finalData)

      );


      console.log(
        "Education saved successfully:",
        finalData
      );


      // =================================================
      // GO TO EXPERIENCE
      // =================================================

      navigate("/experience");

    }

    catch (error) {

      console.error(
        "Failed to save education:",
        error
      );

      if (error.response) {

        console.error(
          "Backend status:",
          error.response.status
        );

        console.error(
          "Backend response:",
          error.response.data
        );

      }

      alert(
        "Failed to save education."
      );

    }

    finally {

      setLoading(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="education-page">

      <div className="education-card">

        <h2>Education</h2>

        <p>Step 2 of 8</p>

        <div className="progress mb-4">

          <div
            className="progress-bar bg-primary"
            style={{ width: "25%" }}
          ></div>

        </div>


        {/* Degree */}

        <div className="input-box">

          <FaGraduationCap
            className="input-icon"
          />

          <input
            type="text"
            name="degree"
            placeholder="Degree"
            value={form.degree}
            onChange={handleChange}
          />

        </div>


        {/* College */}

        <div className="input-box">

          <FaSchool
            className="input-icon"
          />

          <input
            type="text"
            name="college"
            placeholder="College"
            value={form.college}
            onChange={handleChange}
          />

        </div>


        {/* University */}

        <div className="input-box">

          <FaUniversity
            className="input-icon"
          />

          <input
            type="text"
            name="university"
            placeholder="University"
            value={form.university}
            onChange={handleChange}
          />

        </div>


        {/* Start / End Year */}

        <div className="row">

          <div className="col-md-6">

            <div className="input-box">

              <FaCalendarAlt
                className="input-icon"
              />

              <input
                type="text"
                name="startYear"
                placeholder="Start Year"
                value={form.startYear}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="col-md-6">

            <div className="input-box">

              <FaCalendarAlt
                className="input-icon"
              />

              <input
                type="text"
                name="endYear"
                placeholder="End Year"
                value={form.endYear}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>


        {/* Percentage */}

        <div className="input-box">

          <FaPercentage
            className="input-icon"
          />

          <input
            type="text"
            name="percentage"
            placeholder="CGPA / Percentage"
            value={form.percentage}
            onChange={handleChange}
          />

        </div>


        {/* Add / Update */}

        <button
          className="add-btn"
          onClick={addEducation}
          disabled={loading}
        >

          <FaPlus />

          {editId !== null
            ? " Update Education"
            : " Add Education"}

        </button>


        <hr />


        {/* Education List */}

        {

          educations.length === 0

            ?

            (

              <div className="empty-box">

                <h4>
                  No Education Added
                </h4>

              </div>

            )

            :

            educations.map((item) => (

              <div
                key={item.id}
                className="education-item"
              >

                <div>

                  <h4>
                    {item.degree}
                  </h4>

                  <p>
                    {item.college}
                  </p>

                  <p>
                    {item.university}
                  </p>

                  <small>

                    {item.startYear}

                    {" - "}

                    {item.endYear}

                  </small>

                  <br />

                  <strong>

                    {item.percentage}

                  </strong>

                </div>


                <div>

                  {/* EDIT */}

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editEducation(item)
                    }
                    disabled={loading}
                  >

                    <FaEdit />

                  </button>


                  {/* DELETE */}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteEducation(item.id)
                    }
                    disabled={loading}
                  >

                    <FaTrash />

                  </button>

                </div>

              </div>

            ))

        }


        {/* Navigation */}

        <div className="button-group">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/personal")
            }
            disabled={loading}
          >

            Back

          </button>


          <button
            className="next-btn"
            onClick={saveEducation}
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Save & Next"}

          </button>

        </div>

      </div>

    </div>

  );

}

export default Education;