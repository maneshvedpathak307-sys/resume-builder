import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaBriefcase,
  FaCalendarAlt,
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

import api from "../service/api";
import "./Experience.css";

function Experience() {

  const navigate = useNavigate();

  // =====================================================
  // PERSONAL ID
  // =====================================================

  const personalId = localStorage.getItem("personalId");


  // =====================================================
  // STATE
  // =====================================================

  const [experiences, setExperiences] = useState([]);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({

    company: "",

    designation: "",

    employmentType: "Full Time",

    startDate: "",

    endDate: "",

    currentWorking: false,

    description: ""

  });


  // =====================================================
  // LOAD EXPERIENCE FROM DATABASE
  // =====================================================

  useEffect(() => {

    if (!personalId) {

      alert(
        "Personal information not found. Please complete Personal Information first."
      );

      navigate("/personal");

      return;
    }


    api.get(`/experience/personal/${personalId}`)

      .then((res) => {

        console.log(
          "Experience API response:",
          res.data
        );


        const data = res.data.map((item) => ({

          id: item.id,

          company: item.company || "",

          designation: item.designation || "",

          employmentType:
            item.employmentType || "Full Time",

          startDate: item.startDate || "",

          endDate: item.endDate || "",

          currentWorking:
            item.currentWorking || false,

          description: item.description || ""

        }));


        setExperiences(data);


        console.log(
          "Experience data from backend:",
          data
        );

      })

      .catch((error) => {

        console.error(
          "Failed to load experience:",
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

    const {
      name,
      value,
      type,
      checked
    } = e.target;


    setForm({

      ...form,

      [name]:
        type === "checkbox"
          ? checked
          : value

    });

  };


  // =====================================================
  // ADD / UPDATE EXPERIENCE
  // =====================================================

  const addExperience = () => {

    if (

      form.company.trim() === "" ||

      form.designation.trim() === ""

    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }


    // =================================================
    // UPDATE EXISTING EXPERIENCE
    // =================================================

    if (editId !== null) {

      const updated = experiences.map(
        (item) =>

          item.id === editId

            ? {
                ...form,
                id: editId
              }

            : item
      );


      setExperiences(updated);

      setEditId(null);

    }


    // =================================================
    // ADD NEW EXPERIENCE
    // =================================================

    else {

      setExperiences([

        ...experiences,

        {

          id: Date.now(),

          ...form

        }

      ]);

    }


    // =================================================
    // CLEAR FORM
    // =================================================

    setForm({

      company: "",

      designation: "",

      employmentType: "Full Time",

      startDate: "",

      endDate: "",

      currentWorking: false,

      description: ""

    });

  };


  // =====================================================
  // EDIT EXPERIENCE
  // =====================================================

  const editExperience = (item) => {

    setForm({

      company: item.company || "",

      designation: item.designation || "",

      employmentType:
        item.employmentType || "Full Time",

      startDate: item.startDate || "",

      endDate: item.endDate || "",

      currentWorking:
        item.currentWorking || false,

      description: item.description || ""

    });


    setEditId(item.id);


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };


  // =====================================================
  // DELETE EXPERIENCE
  // =====================================================

  const deleteExperience = async (id) => {

    try {

      /*
       * Date.now() creates temporary frontend IDs.
       * Database IDs are much smaller.
       */

      const isDatabaseId =
        Number(id) < 1000000000000;


      if (isDatabaseId) {

        await api.delete(
          `/experience/${id}`
        );

      }


      const updated =
        experiences.filter(
          (item) => item.id !== id
        );


      setExperiences(updated);


      // If currently editing this item

      if (editId === id) {

        setEditId(null);


        setForm({

          company: "",

          designation: "",

          employmentType: "Full Time",

          startDate: "",

          endDate: "",

          currentWorking: false,

          description: ""

        });

      }

    }

    catch (error) {

      console.error(
        "Failed to delete experience:",
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
        "Failed to delete experience."
      );

    }

  };


  // =====================================================
  // SAVE EXPERIENCE
  // =====================================================

  const saveExperience = async () => {

    if (experiences.length === 0) {

      alert(
        "Please add at least one experience."
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

      const savedExperiences = [];


      // =================================================
      // SAVE EACH EXPERIENCE
      // =================================================

      for (const item of experiences) {

        const data = {

          company: item.company,

          designation: item.designation,

          employmentType:
            item.employmentType,

          startDate: item.startDate,

          endDate: item.currentWorking
            ? null
            : item.endDate,

          currentWorking:
            item.currentWorking,

          description: item.description,

          personal: {

            id: Number(personalId)

          }

        };


        let response;


        // =================================================
        // EXISTING DATABASE RECORD
        // =================================================

        if (
          item.id &&
          Number(item.id) < 1000000000000
        ) {

          console.log(
            "Updating experience:",
            item.id
          );


          response = await api.put(

            `/experience/${item.id}`,

            data

          );

        }


        // =================================================
        // NEW FRONTEND RECORD
        // =================================================

        else {

          console.log(
            "Creating new experience..."
          );


          response = await api.post(

            "/experience",

            data

          );

        }


        console.log(
          "Experience API response:",
          response.data
        );


        savedExperiences.push(
          response.data
        );

      }


      // =================================================
      // UPDATE SCREEN WITH DATABASE IDs
      // =================================================

      const finalData =
        savedExperiences.map((item) => ({

          id: item.id,

          company: item.company || "",

          designation:
            item.designation || "",

          employmentType:
            item.employmentType || "Full Time",

          startDate:
            item.startDate || "",

          endDate:
            item.endDate || "",

          currentWorking:
            item.currentWorking || false,

          description:
            item.description || ""

        }));


      setExperiences(finalData);


      // =================================================
      // LOCAL STORAGE BACKUP
      // =================================================

      localStorage.setItem(

        "experience",

        JSON.stringify(finalData)

      );


      console.log(
        "Experience saved successfully:",
        finalData
      );


      // =================================================
      // NEXT PAGE
      // =================================================

      navigate("/skills");

    }

    catch (error) {

      console.error(
        "Failed to save experience:",
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
        "Failed to save experience."
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

    <div className="experience-page">

      <div className="experience-card">

        <h2>Work Experience</h2>

        <p>Step 3 of 8</p>

        <div className="progress mb-4">

          <div
            className="progress-bar bg-primary"
            style={{ width: "37.5%" }}
          ></div>

        </div>


        {/* Company */}

        <div className="input-box">

          <FaBuilding className="input-icon"/>

          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
          />

        </div>


        {/* Designation */}

        <div className="input-box">

          <FaBriefcase className="input-icon"/>

          <input
            type="text"
            name="designation"
            placeholder="Job Title"
            value={form.designation}
            onChange={handleChange}
          />

        </div>


        {/* Employment Type */}

        <select
          className="form-select mb-3"
          name="employmentType"
          value={form.employmentType}
          onChange={handleChange}
        >

          <option>Full Time</option>

          <option>Part Time</option>

          <option>Internship</option>

          <option>Freelance</option>

        </select>


        <div className="row">

          <div className="col-md-6">

            <div className="input-box">

              <FaCalendarAlt className="input-icon"/>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />

            </div>

          </div>


          <div className="col-md-6">

            <div className="input-box">

              <FaCalendarAlt className="input-icon"/>

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                disabled={form.currentWorking}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>


        {/* Current Working */}

        <div className="form-check mb-3">

          <input
            type="checkbox"
            className="form-check-input"
            name="currentWorking"
            checked={form.currentWorking}
            onChange={handleChange}
          />

          <label className="form-check-label">

            I currently work here

          </label>

        </div>


        {/* Description */}

        <div className="input-box">

          <FaFileAlt className="input-icon"/>

          <textarea
            rows="4"
            name="description"
            placeholder="Describe your responsibilities and achievements..."
            value={form.description}
            onChange={handleChange}
          />

        </div>


        {/* ADD BUTTON */}

        <button
          className="add-btn"
          onClick={addExperience}
          disabled={loading}
        >

          <FaPlus />

          {editId !== null
            ? " Update Experience"
            : " Add Experience"}

        </button>


        <hr />


        {/* Experience List */}

        {

          experiences.length === 0

            ?

            (

              <div className="empty-box">

                <h4>
                  No Experience Added
                </h4>

              </div>

            )

            :

            experiences.map((item) => (

              <div
                key={item.id}
                className="experience-item"
              >

                <div>

                  <h4>
                    {item.designation}
                  </h4>

                  <p>
                    {item.company}
                  </p>

                  <small>

                    {item.startDate}

                    {" - "}

                    {item.currentWorking
                      ? "Present"
                      : item.endDate}

                  </small>

                  <br/>

                  <strong>

                    {item.employmentType}

                  </strong>

                  <p className="mt-2">

                    {item.description}

                  </p>

                </div>


                <div>

                  {/* EDIT */}

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editExperience(item)
                    }
                    disabled={loading}
                  >

                    <FaEdit/>

                  </button>


                  {/* DELETE */}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteExperience(item.id)
                    }
                    disabled={loading}
                  >

                    <FaTrash/>

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
              navigate("/education")
            }
            disabled={loading}
          >

            Back

          </button>


          <button
            className="next-btn"
            onClick={saveExperience}
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

export default Experience;