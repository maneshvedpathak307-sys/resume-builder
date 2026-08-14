import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaFileAlt,
  FaPlusCircle,
  FaUserCircle,
  FaSignOutAlt,
  FaChartBar
} from "react-icons/fa";

import api from "../service/api";

import "./Dashboard.css";


function Dashboard() {

  const navigate = useNavigate();


  const [user, setUser] = useState({});

  const [resumes, setResumes] = useState([]);

  const [profileCompletion, setProfileCompletion] =
    useState(0);


  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const userId =
      localStorage.getItem("userId");


    /*
     * ============================
     * LOGIN CHECK
     * ============================
     */

    if (!token) {

      navigate("/login");

      return;

    }


    if (!userId) {

      navigate("/login");

      return;

    }


    /*
     * ============================
     * USER INFORMATION
     * ============================
     */

    setUser({

      name:
        localStorage.getItem("fullName")

    });


    /*
     * ============================
     * GET ALL USER RESUMES
     * ============================
     */

    const loadDashboard =
      async () => {

        try {

          const response =
            await api.get(
              `/personal/user/${userId}`
            );


          const allResumes =
            response.data || [];


          /*
           * Save resumes
           */

          setResumes(
            allResumes
          );


          /*
           * ============================
           * NO RESUMES
           * ============================
           */

          if (
            allResumes.length === 0
          ) {

            setProfileCompletion(0);

            return;

          }


          /*
           * ============================
           * CALCULATE EVERY RESUME
           * ============================
           */

          const completionValues =
            await Promise.all(

              allResumes.map(
                async (resume) => {

                  try {

                    const personalResponse =
                      await api.get(
                        `/personal/${resume.id}`
                      );


                    const personal =
                      personalResponse.data || {};


                    /*
                     * Fields used for
                     * profile completion
                     */

                    const fields = [

                      personal.firstName,

                      personal.lastName,

                      personal.email,

                      personal.phone,

                      personal.address,

                      personal.linkedin,

                      personal.github,

                      personal.summary

                    ];


                    /*
                     * Count completed fields
                     */

                    const completed =
                      fields.filter(
                        field =>
                          field &&
                          field
                            .toString()
                            .trim() !== ""
                      ).length;


                    /*
                     * Calculate percentage
                     */

                    const percentage =
                      Math.round(
                        (
                          completed /
                          fields.length
                        ) * 100
                      );


                    return percentage;

                  } catch (error) {

                    console.error(
                      `Profile calculation error for resume ${resume.id}:`,
                      error
                    );


                    return 0;

                  }

                }
              )

            );


          /*
           * ============================
           * AVERAGE PROFILE COMPLETION
           * ============================
           */

          const total =
            completionValues.reduce(
              (sum, value) =>
                sum + value,
              0
            );


          const average =
            Math.round(
              total /
              completionValues.length
            );


          setProfileCompletion(
            average
          );


        } catch (error) {

          console.error(
            "Dashboard loading error:",
            error
          );

        }

      };


    loadDashboard();

  }, [navigate]);


  /*
   * ============================
   * LOGOUT
   * ============================
   */

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem(
      "personalId"
    );

    localStorage.removeItem(
      "userId"
    );

    localStorage.removeItem(
      "fullName"
    );


    navigate("/", { replace: true });

  };


  /*
   * ============================
   * DASHBOARD
   * ============================
   */

  return (

    <div className="dashboard">


      {/* ============================
          SIDEBAR
      ============================ */}

      <div className="sidebar">

        <h2 className="logo">

          Resume Builder

        </h2>


        <ul>


          {/* Dashboard */}

          <li
            onClick={() =>
              navigate("/dashboard")
            }
          >

            <FaHome />

            <span>
              Dashboard
            </span>

          </li>


          {/* Create Resume */}

          <li
            onClick={() => {

              /*
               * Remove old resume ID
               */

              localStorage.removeItem(
                "personalId"
              );


              /*
               * Remove temporary form data
               */

              localStorage.removeItem(
                "personal"
              );

              localStorage.removeItem(
                "education"
              );

              localStorage.removeItem(
                "experience"
              );

              localStorage.removeItem(
                "skills"
              );

              localStorage.removeItem(
                "projects"
              );

              localStorage.removeItem(
                "certifications"
              );

              localStorage.removeItem(
                "languages"
              );


              /*
               * Create new resume
               */

              navigate(
                "/personal"
              );

            }}
          >

            <FaPlusCircle />

            <span>
              Create Resume
            </span>

          </li>


          {/* My Resumes */}

          <li
            onClick={() =>
              navigate("/my-resumes")
            }
          >

            <FaFileAlt />

            <span>
              My Resumes
            </span>

          </li>


          {/* Analytics */}

          <li
            onClick={() =>
              navigate("/analytics")
            }
          >

            <FaChartBar />

            <span>
              Analytics
            </span>

          </li>


        </ul>


        {/* Logout */}

        <button
          className="logout-btn"
          onClick={logout}
        >

          <FaSignOutAlt />

          Logout

        </button>


      </div>


      {/* ============================
          MAIN CONTENT
      ============================ */}

      <div className="main-content">


        {/* Topbar */}

        <div className="topbar">

          <h2>

            Welcome,{" "}

            {
              user.name ||
              localStorage.getItem(
                "fullName"
              )
            }

          </h2>

        </div>


        {/* ============================
            CARDS
        ============================ */}

        <div className="row">


          {/* ============================
              TOTAL RESUMES
          ============================ */}

          <div className="col-md-4">

            <div className="dashboard-card">

              <FaFileAlt
                className="card-icon blue"
              />

              <h3>

                {
                  resumes.length
                }

              </h3>

              <p>

                Total Resumes

              </p>

            </div>

          </div>


          {/* ============================
              PROFILE COMPLETION
          ============================ */}

          <div className="col-md-4">

            <div className="dashboard-card">

              <FaUserCircle
                className="card-icon green"
              />

              <h3>

                {
                  profileCompletion
                }%

              </h3>

              <p>

                Profile Completion

              </p>

            </div>

          </div>


          {/* ============================
              ACCOUNT STATUS
          ============================ */}

          <div className="col-md-4">

            <div className="dashboard-card">

              <FaChartBar
                className="card-icon orange"
              />

              <h3>

                Active

              </h3>

              <p>

                Account Status

              </p>

            </div>

          </div>


        </div>


      </div>

    </div>

  );

}


export default Dashboard;