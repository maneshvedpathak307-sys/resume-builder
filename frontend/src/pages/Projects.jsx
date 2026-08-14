import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaProjectDiagram,
  FaCode,
  FaGithub,
  FaGlobe,
  FaFileAlt,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";

import api from "../service/api";
import "./Projects.css";

function Projects() {

  const navigate = useNavigate();

  const personalId = localStorage.getItem("personalId");

  const [projects, setProjects] = useState([]);

  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({

    title: "",

    technology: "",

    github: "",

    liveDemo: "",

    description: ""

  });


  // =====================================================
  // LOAD PROJECTS FROM DATABASE
  // =====================================================

  useEffect(() => {

    if (!personalId) {

      alert(
        "Personal information not found. Please complete Personal Information first."
      );

      navigate("/personal");

      return;
    }

    api.get(`/projects/personal/${personalId}`)
      .then((res) => {

        console.log("Projects data:", res.data);

        const data = res.data.map((project) => ({

          id: project.id,

          title: project.title || "",

          technology: project.technology || "",

          github: project.githubLink || "",

          liveDemo: project.liveDemo || "",

          description: project.description || ""

        }));

        setProjects(data);

      })
      .catch((error) => {

        console.error(
          "Failed to load projects:",
          error
        );

        if (error.response) {

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
  // ADD / UPDATE PROJECT
  // =====================================================

  const addProject = () => {

    if (
      form.title.trim() === "" ||
      form.technology.trim() === ""
    ) {

      alert(
        "Project Title and Technology are required."
      );

      return;
    }


    // UPDATE EXISTING PROJECT

    if (editId !== null) {

      const updated = projects.map((item) =>

        item.id === editId

          ? {
              ...form,
              id: editId
            }

          : item

      );

      setProjects(updated);

      setEditId(null);

    }


    // ADD NEW PROJECT

    else {

      setProjects([

        ...projects,

        {
          id: Date.now(),

          ...form

        }

      ]);

    }


    // CLEAR FORM

    setForm({

      title: "",

      technology: "",

      github: "",

      liveDemo: "",

      description: ""

    });

  };


  // =====================================================
  // EDIT PROJECT
  // =====================================================

  const editProject = (item) => {

    setForm({

      title: item.title || "",

      technology: item.technology || "",

      github: item.github || "",

      liveDemo: item.liveDemo || "",

      description: item.description || ""

    });

    setEditId(item.id);

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };


  // =====================================================
  // DELETE PROJECT
  // =====================================================

  const deleteProject = async (id) => {

    try {

      /*
       * Date.now() IDs are temporary frontend IDs.
       * Database IDs are much smaller.
       */

      const isDatabaseId =
        Number(id) < 1000000000000;


      // Delete from database

      if (isDatabaseId) {

        await api.delete(
          `/projects/${id}`
        );

      }


      // Remove from React state

      const updated = projects.filter(
        (item) => item.id !== id
      );

      setProjects(updated);


      // If currently editing this project

      if (editId === id) {

        setEditId(null);

        setForm({

          title: "",

          technology: "",

          github: "",

          liveDemo: "",

          description: ""

        });

      }

    }

    catch (error) {

      console.error(
        "Failed to delete project:",
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
        "Failed to delete project."
      );

    }

  };


  // =====================================================
  // SAVE PROJECTS
  // =====================================================

  const saveProjects = async () => {

    if (projects.length === 0) {

      alert(
        "Please add at least one project."
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

      const savedProjects = [];


      // SAVE EACH PROJECT

      for (const item of projects) {

        const data = {

          title: item.title,

          technology: item.technology,

          githubLink: item.github,

          liveDemo: item.liveDemo,

          description: item.description,

          personal: {

            id: Number(personalId)

          }

        };


        let response;


        /*
         * EXISTING DATABASE PROJECT
         */

        if (
          item.id &&
          Number(item.id) < 1000000000000
        ) {

          response = await api.put(

            `/projects/${item.id}`,

            data

          );

        }


        /*
         * NEW FRONTEND PROJECT
         */

        else {

          response = await api.post(

            "/projects",

            data

          );

        }


        savedProjects.push(
          response.data
        );

      }


      // =================================================
      // REPLACE TEMPORARY IDs WITH DATABASE IDs
      // =================================================

      const finalData =
        savedProjects.map((item) => ({

          id: item.id,

          title: item.title || "",

          technology: item.technology || "",

          github: item.githubLink || "",

          liveDemo: item.liveDemo || "",

          description: item.description || ""

        }));


      setProjects(finalData);


      // =================================================
      // LOCAL STORAGE BACKUP
      // =================================================

      localStorage.setItem(

        "projects",

        JSON.stringify(finalData)

      );


      console.log(
        "Projects saved successfully:",
        finalData
      );


      // =================================================
      // NEXT PAGE
      // =================================================

      navigate("/certifications");

    }

    catch (error) {

      console.error(
        "Failed to save projects:",
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
        "Failed to save projects."
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

    <div className="projects-page">

      <div className="projects-card">

        <h2>Projects</h2>

        <p>Step 5 of 8</p>

        <div className="progress mb-4">

          <div
            className="progress-bar bg-primary"
            style={{ width: "62.5%" }}
          ></div>

        </div>


        {/* Project Title */}

        <div className="input-box">

          <FaProjectDiagram
            className="input-icon"
          />

          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={form.title}
            onChange={handleChange}
          />

        </div>


        {/* Technology */}

        <div className="input-box">

          <FaCode
            className="input-icon"
          />

          <input
            type="text"
            name="technology"
            placeholder="Technology Used"
            value={form.technology}
            onChange={handleChange}
          />

        </div>


        {/* GitHub */}

        <div className="input-box">

          <FaGithub
            className="input-icon"
          />

          <input
            type="url"
            name="github"
            placeholder="GitHub Repository Link"
            value={form.github}
            onChange={handleChange}
          />

        </div>


        {/* Live Demo */}

        <div className="input-box">

          <FaGlobe
            className="input-icon"
          />

          <input
            type="url"
            name="liveDemo"
            placeholder="Live Demo Link"
            value={form.liveDemo}
            onChange={handleChange}
          />

        </div>


        {/* Description */}

        <div className="input-box">

          <FaFileAlt
            className="input-icon"
          />

          <textarea
            rows="4"
            name="description"
            placeholder="Project Description"
            value={form.description}
            onChange={handleChange}
          />

        </div>


        {/* Add / Update */}

        <button
          className="add-btn"
          onClick={addProject}
          disabled={loading}
        >

          <FaPlus />

          {editId !== null
            ? " Update Project"
            : " Add Project"}

        </button>


        <hr />


        {/* Project List */}

        {

          projects.length === 0

            ?

            (

              <div className="empty-box">

                <h4>
                  No Projects Added
                </h4>

              </div>

            )

            :

            projects.map((item) => (

              <div
                key={item.id}
                className="project-item"
              >

                <div>

                  <h4>
                    {item.title}
                  </h4>


                  <p>

                    <strong>
                      Technology:
                    </strong>

                    {" "}

                    {item.technology}

                  </p>


                  {

                    item.github && (

                      <p>

                        <strong>
                          GitHub:
                        </strong>

                        {" "}

                        <a
                          href={item.github}
                          target="_blank"
                          rel="noreferrer"
                        >

                          Repository

                        </a>

                      </p>

                    )

                  }


                  {

                    item.liveDemo && (

                      <p>

                        <strong>
                          Live Demo:
                        </strong>

                        {" "}

                        <a
                          href={item.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                        >

                          Visit

                        </a>

                      </p>

                    )

                  }


                  <p>
                    {item.description}
                  </p>

                </div>


                <div>

                  {/* EDIT */}

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editProject(item)
                    }
                    disabled={loading}
                  >

                    <FaEdit />

                  </button>


                  {/* DELETE */}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteProject(item.id)
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
              navigate("/skills")
            }
            disabled={loading}
          >

            Back

          </button>


          <button
            className="next-btn"
            onClick={saveProjects}
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

export default Projects;