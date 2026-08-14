import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaPrint,
  FaEdit,
  FaArrowLeft
} from "react-icons/fa";
import "./Preview.css";

function Preview() {

  const navigate = useNavigate();

  const template =
    localStorage.getItem("template") || "Modern";

  const personal =
    JSON.parse(localStorage.getItem("personal")) || {};

  const education =
    JSON.parse(localStorage.getItem("education")) || [];

  const experience =
    JSON.parse(localStorage.getItem("experience")) || [];

  const skills =
    JSON.parse(localStorage.getItem("skills")) || [];

  const projects =
    JSON.parse(localStorage.getItem("projects")) || [];

  const certifications =
    JSON.parse(localStorage.getItem("certifications")) || [];

  const languages =
    JSON.parse(localStorage.getItem("languages")) || [];

  const printResume = () => {

    window.print();

  };

  return (

<div className="preview-page">

<div className="toolbar">

  <div className="toolbar-left">

    <button
      className="back-btn"
      onClick={() => navigate("/templates")}
    >
      <FaArrowLeft /> Back
    </button>

  </div>

  <div className="toolbar-right">

    <button
      className="edit-btn"
      onClick={() => navigate("/personal")}
    >
      <FaEdit /> Edit
    </button>

    <button
      className="print-btn"
      onClick={printResume}
    >
      <FaPrint /> Print
    </button>

    <button
      className="download-btn"
      onClick={printResume}
    >
      <FaDownload /> Download PDF
    </button>

  </div>

</div>

<div className={`resume ${template.toLowerCase()}`}>

{/* Header */}

<div className="resume-header">

{

personal.photo && (

<img

src={personal.photo}

alt="Profile"

className="profile-photo"

/>

)

}

<h1>

{personal.fullName}

</h1>

<h4>

{personal.email}

</h4>

<p>

{personal.phone}

</p>

<p>

{personal.address}

</p>

</div>

{/* Career Objective */}

<div className="resume-section">

<h2>

Career Objective

</h2>

<p>

{personal.objective}

</p>

</div>

{/* Education */}

<div className="resume-section">

<h2>

Education

</h2>

{

education.map((item)=>(

<div
key={item.id}
className="resume-item"
>

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

-

{item.endYear}

</small>

</div>

))

}
</div>

        {/* Experience */}

        <div className="resume-section">

          <h2>Experience</h2>

          {

            experience.map((item) => (

              <div
                key={item.id}
                className="resume-item"
              >

                <h4>

                  {item.designation}

                </h4>

                <p>

                  {item.company}

                </p>

                <small>

                  {item.startDate}

                  {" - "}

                  {

                    item.currentWorking

                      ? "Present"

                      : item.endDate

                  }

                </small>

                <p>

                  {item.description}

                </p>

              </div>

            ))

          }

        </div>

        {/* Skills */}

        <div className="resume-section">

          <h2>Skills</h2>

          <div className="skills-wrap">

            {

              skills.map((item) => (

                <span
                  key={item.id}
                  className="skill-chip"
                >

                  {item.skill}

                </span>

              ))

            }

          </div>

        </div>

        {/* Projects */}

        <div className="resume-section">

          <h2>Projects</h2>

          {

            projects.map((item) => (

              <div
                key={item.id}
                className="resume-item"
              >

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

                <p>

                  {item.description}

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

                        {item.github}

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

                        {item.liveDemo}

                      </a>

                    </p>

                  )

                }

              </div>

            ))

          }

        </div>

        {/* Certifications */}

        <div className="resume-section">

          <h2>Certifications</h2>

          {

            certifications.map((item) => (

              <div
                key={item.id}
                className="resume-item"
              >

                <h4>

                  {item.certificate}

                </h4>

                <p>

                  {item.organization}

                </p>

                <small>

                  {item.issueDate}

                </small>

              </div>

            ))

          }

        </div>

        {/* Languages */}

        <div className="resume-section">

          <h2>Languages</h2>

          <div className="skills-wrap">

            {

              languages.map((item) => (

                <span
                  key={item.id}
                  className="skill-chip"
                >

                  {item.language}

                  {" - "}

                  {item.level}

                </span>

              ))

            }

          </div>

        </div>

      </div>

    </div>

  );

}

export default Preview;