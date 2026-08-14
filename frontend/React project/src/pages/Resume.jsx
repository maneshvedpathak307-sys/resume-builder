import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaDownload,
  FaEdit,
  FaSave,
  FaHome
} from "react-icons/fa";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import api from "../service/api";

import "./Resume.css";

function Resume() {

  const navigate = useNavigate();

  const personalId = localStorage.getItem("personalId");

  const template =
    localStorage.getItem("template") || "Professional";

  const [personal, setPersonal] = useState({});
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {

    const loadResume = async () => {

      try {

        const personalRes =
          await api.get(`/personal/${personalId}`);

        setPersonal(personalRes.data);


        const educationRes =
          await api.get(
            `/education/personal/${personalId}`
          );

        setEducation(educationRes.data);


        const experienceRes =
          await api.get(
            `/experience/personal/${personalId}`
          );

        setExperience(experienceRes.data);


        const skillsRes =
          await api.get(
            `/skills/personal/${personalId}`
          );

        setSkills(skillsRes.data);


        const projectsRes =
          await api.get(
            `/projects/personal/${personalId}`
          );

        setProjects(projectsRes.data);


        const certificationsRes =
          await api.get(
            `/certifications/personal/${personalId}`
          );

        setCertifications(certificationsRes.data);


        const languagesRes =
          await api.get(
            `/languages/personal/${personalId}`
          );

        setLanguages(languagesRes.data);

      } catch (error) {

        console.error(
          "Failed to load resume:",
          error
        );

      }

    };


    if (personalId) {
      loadResume();
    }

  }, [personalId]);


  const shortText = (text, max) => {

    if (!text) {
      return "";
    }

    return text.length > max
      ? text.substring(0, max) + "..."
      : text;

  };


  const saveResume = () => {

    alert("Resume Saved Successfully.");

    navigate("/dashboard");

  };


  const downloadResume = async () => {

    const element =
      document.querySelector(".resume-container");

    if (!element) {
      return;
    }

    const canvas =
      await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });


    const imgData =
      canvas.toDataURL("image/png");


    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });


    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      210,
      297
    );


    pdf.save(
      `${personal.firstName || "Resume"}_Resume.pdf`
    );

  };


  return (

    <div className="resume-page">

      {/* ================= TOOLBAR ================= */}

      <div className="resume-toolbar">

        <button
          className="toolbar-btn back"
          onClick={() => navigate("/templates")}
        >

          <FaArrowLeft />

          Back

        </button>


        <div className="toolbar-right">

          <button
            className="toolbar-btn edit"
            onClick={() => navigate("/personal")}
          >

            <FaEdit />

            Edit

          </button>


          <button
            className="toolbar-btn download"
            onClick={downloadResume}
          >

            <FaDownload />

            Download PDF

          </button>


          <button
            className="toolbar-btn save"
            onClick={saveResume}
          >

            <FaSave />

            Save Resume

          </button>


          <button
            className="toolbar-btn dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >

            <FaHome />

            Dashboard

          </button>

        </div>

      </div>


      {/* ================= RESUME ================= */}

      <div
        className={`resume-container ${template.toLowerCase()}`}
      >


        {/* ================= HEADER ================= */}

        <div className="resume-header">

          <h1>

            {`${personal.firstName || ""} ${
              personal.lastName || ""
            }`.trim()}

          </h1>


          <div className="contact-row">

            <span>
              <strong>Email:</strong>{" "}
              {personal.email}
            </span>


            <span>
              <strong>Phone:</strong>{" "}
              {personal.phone}
            </span>


            <span>
              <strong>Address:</strong>{" "}
              {personal.address}
            </span>

          </div>


          <div className="contact-row">

            <span>
              <strong>LinkedIn:</strong>{" "}
              {shortText(personal.linkedin, 45)}
            </span>


            <span>
              <strong>GitHub:</strong>{" "}
              {shortText(personal.github, 45)}
            </span>

          </div>

        </div>


        {/* ================= BODY ================= */}

        <div className="resume-body">


          {/* ================= LEFT COLUMN ================= */}

          <div className="left-column">


            {/* SUMMARY */}

            <section className="resume-section">

              <h2>
                Professional Summary
              </h2>

              <p className="summary-text">

                {shortText(
                  personal.summary,
                  450
                )}

              </p>

            </section>


            {/* SKILLS */}

            <section className="resume-section">

              <h2>
                Skills
              </h2>


              <div className="badge-container">

                {skills.length === 0 ? (

                  <p>
                    No skills added.
                  </p>

                ) : (

                  skills.map((item) => (

                    <span
                      key={item.id}
                      className="skill-badge"
                    >

                      {item.skillName}

                    </span>

                  ))

                )}

              </div>

            </section>


            {/* LANGUAGES */}

            <section className="resume-section">

              <h2>
                Languages
              </h2>


              <div className="badge-container">

                {languages.length === 0 ? (

                  <p>
                    No languages added.
                  </p>

                ) : (

                  languages.map((item) => (

                    <span
                      key={item.id}
                      className="language-badge"
                    >

                      {item.languageName}

                    </span>

                  ))

                )}

              </div>

            </section>

          </div>


          {/* ================= RIGHT COLUMN ================= */}

          <div className="right-column">


            {/* EXPERIENCE */}

            {experience.length > 0 && (

              <section className="resume-section">

                <h2>
                  Experience
                </h2>


                {experience.map((item) => (

                  <div
                    key={item.id}
                    className="resume-item"
                  >

                    <h3>
                      {item.position}
                    </h3>


                    <h4>
                      {item.company}
                    </h4>


                    <div className="resume-date">

                      {item.startDate}

                      {" - "}

                      {item.currentWorking
                        ? "Present"
                        : item.endDate}

                    </div>


                    <p>

                      {item.description}

                    </p>

                  </div>

                ))}

              </section>

            )}


            {/* EDUCATION */}

            {education.length > 0 && (

              <section className="resume-section">

                <h2>
                  Education
                </h2>


                {education.map((item) => (

                  <div
                    key={item.id}
                    className="resume-item"
                  >

                    <h3>
                      {item.degree}
                    </h3>


                    <h4>
                      {item.college}
                    </h4>


                    <p className="university">

                      {item.university}

                    </p>


                    <div className="resume-date">

                      {item.startYear}

                      {" - "}

                      {item.endYear}

                    </div>

                  </div>

                ))}

              </section>

            )}


            {/* PROJECTS */}

            {projects.length > 0 && (

              <section className="resume-section">

                <h2>
                  Projects
                </h2>


                {projects.map((item) => (

                  <div
                    key={item.id}
                    className="resume-item"
                  >

                    <h3>
                      {item.title}
                    </h3>


                    <h4>
                      {item.technology}
                    </h4>


                    <p>

                      {item.description}

                    </p>

                  </div>

                ))}

              </section>

            )}


            {/* CERTIFICATIONS */}

            {certifications.length > 0 && (

              <section className="resume-section">

                <h2>
                  Certifications
                </h2>


                {certifications.map((item) => (

                  <div
                    key={item.id}
                    className="resume-item"
                  >

                    <h3>
                      {item.certificationName}
                    </h3>


                    <h4>
                      {item.organization}
                    </h4>


                    <div className="resume-date">

                      {item.issueDate}

                    </div>

                  </div>

                ))}

              </section>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default Resume;