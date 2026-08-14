import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaChartBar,
    FaFileAlt,
    FaGraduationCap,
    FaBriefcase,
    FaCode,
    FaProjectDiagram,
    FaCertificate,
    FaLanguage
} from "react-icons/fa";

import api from "../service/api";

import "./Analytics.css";


function Analytics() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [resumes, setResumes] = useState([]);

    const [stats, setStats] = useState({
        resumes: 0,
        education: 0,
        experience: 0,
        skills: 0,
        projects: 0,
        certifications: 0,
        languages: 0
    });


    useEffect(() => {

        const token =
            localStorage.getItem("token");

        const userId =
            localStorage.getItem("userId");


        /*
         * User must be logged in
         */

        if (!token) {

            navigate("/login");

            return;

        }


        if (!userId) {

            setLoading(false);

            return;

        }


        const loadAnalytics = async () => {

            try {

                /*
                 * =================================
                 * GET ALL RESUMES OF CURRENT USER
                 * =================================
                 */

                const resumesResponse =
                    await api.get(
                        `/personal/user/${userId}`
                    );


                const allResumes =
                    resumesResponse.data || [];


                /*
                 * =================================
                 * LOAD ANALYTICS FOR EVERY RESUME
                 * =================================
                 */

                const resumeAnalytics =
                    await Promise.all(

                        allResumes.map(
                            async (resume, index) => {

                                const personalId =
                                    resume.id;


                                try {

                                    const [

                                        personalResponse,

                                        educationResponse,

                                        experienceResponse,

                                        skillsResponse,

                                        projectsResponse,

                                        certificationsResponse,

                                        languagesResponse

                                    ] = await Promise.all([

                                        api.get(
                                            `/personal/${personalId}`
                                        ),

                                        api.get(
                                            `/education/personal/${personalId}`
                                        ),

                                        api.get(
                                            `/experience/personal/${personalId}`
                                        ),

                                        api.get(
                                            `/skills/personal/${personalId}`
                                        ),

                                        api.get(
                                            `/projects/personal/${personalId}`
                                        ),

                                        api.get(
                                            `/certifications/personal/${personalId}`
                                        ),

                                        api.get(
                                            `/languages/personal/${personalId}`
                                        )

                                    ]);


                                    const personal =
                                        personalResponse.data || {};


                                    const education =
                                        educationResponse.data || [];


                                    const experience =
                                        experienceResponse.data || [];


                                    const skills =
                                        skillsResponse.data || [];


                                    const projects =
                                        projectsResponse.data || [];


                                    const certifications =
                                        certificationsResponse.data || [];


                                    const languages =
                                        languagesResponse.data || [];


                                    /*
                                     * =================================
                                     * PROFILE COMPLETION
                                     * =================================
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


                                    const completedFields =
                                        fields.filter(
                                            field =>
                                                field &&
                                                field
                                                    .toString()
                                                    .trim() !== ""
                                        ).length;


                                    const profileCompletion =
                                        Math.round(
                                            (
                                                completedFields /
                                                fields.length
                                            ) * 100
                                        );


                                    /*
                                     * =================================
                                     * RETURN ANALYTICS FOR THIS RESUME
                                     * =================================
                                     */

                                    return {

                                        id: personalId,

                                        resumeNumber:
                                            index + 1,

                                        name:
                                            personal.firstName ||
                                            `Resume ${index + 1}`,

                                        fullName:
                                            `${personal.firstName || ""} ${personal.lastName || ""}`
                                                .trim(),

                                        email:
                                            personal.email || "",

                                        profileCompletion,

                                        education:
                                            education.length,

                                        experience:
                                            experience.length,

                                        skills:
                                            skills.length,

                                        projects:
                                            projects.length,

                                        certifications:
                                            certifications.length,

                                        languages:
                                            languages.length

                                    };

                                } catch (error) {

                                    console.error(
                                        `Error loading Resume ${index + 1}:`,
                                        error
                                    );


                                    /*
                                     * If one resume has an error,
                                     * don't stop other resumes.
                                     */

                                    return {

                                        id: personalId,

                                        resumeNumber:
                                            index + 1,

                                        name:
                                            `Resume ${index + 1}`,

                                        fullName:
                                            "",

                                        email:
                                            "",

                                        profileCompletion:
                                            0,

                                        education:
                                            0,

                                        experience:
                                            0,

                                        skills:
                                            0,

                                        projects:
                                            0,

                                        certifications:
                                            0,

                                        languages:
                                            0

                                    };

                                }

                            }
                        )

                    );


                /*
                 * Save all resume analytics
                 */

                setResumes(resumeAnalytics);


                /*
                 * =================================
                 * TOTAL COUNTS
                 * =================================
                 */

                const totalEducation =
                    resumeAnalytics.reduce(
                        (total, resume) =>
                            total + resume.education,
                        0
                    );


                const totalExperience =
                    resumeAnalytics.reduce(
                        (total, resume) =>
                            total + resume.experience,
                        0
                    );


                const totalSkills =
                    resumeAnalytics.reduce(
                        (total, resume) =>
                            total + resume.skills,
                        0
                    );


                const totalProjects =
                    resumeAnalytics.reduce(
                        (total, resume) =>
                            total + resume.projects,
                        0
                    );


                const totalCertifications =
                    resumeAnalytics.reduce(
                        (total, resume) =>
                            total + resume.certifications,
                        0
                    );


                const totalLanguages =
                    resumeAnalytics.reduce(
                        (total, resume) =>
                            total + resume.languages,
                        0
                    );


                /*
                 * Save summary statistics
                 */

                setStats({

                    resumes:
                        resumeAnalytics.length,

                    education:
                        totalEducation,

                    experience:
                        totalExperience,

                    skills:
                        totalSkills,

                    projects:
                        totalProjects,

                    certifications:
                        totalCertifications,

                    languages:
                        totalLanguages

                });


            } catch (error) {

                console.error(
                    "Analytics loading error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        loadAnalytics();

    }, [navigate]);


    /*
     * =================================
     * LOADING
     * =================================
     */

    if (loading) {

        return (

            <div className="analytics-page">

                <div className="analytics-loading">

                    <FaChartBar />

                    <h2>
                        Loading Analytics...
                    </h2>

                </div>

            </div>

        );

    }


    /*
     * =================================
     * MAIN PAGE
     * =================================
     */

    return (

        <div className="analytics-page">


            {/* HEADER */}

            <div className="analytics-header">

                <button
                    className="analytics-back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >

                    <FaArrowLeft />

                    Dashboard

                </button>


                <div className="analytics-title">

                    <FaChartBar />

                    <h1>
                        Resume Analytics
                    </h1>

                </div>

            </div>


            <div className="analytics-container">


                {/* INTRO */}

                <div className="analytics-intro">

                    <h2>
                        Resume Overview
                    </h2>

                    <p>
                        Track the progress of all your resumes.
                    </p>

                </div>


                {/* =================================
                    SUMMARY CARDS
                ================================= */}

                <div className="analytics-grid">


                    {/* RESUMES */}

                    <div className="analytics-card">

                        <div className="analytics-card-icon blue">

                            <FaFileAlt />

                        </div>

                        <div>

                            <h3>
                                {stats.resumes}
                            </h3>

                            <p>
                                Total Resumes
                            </p>

                        </div>

                    </div>


                    {/* EDUCATION */}

                    <div className="analytics-card">

                        <div className="analytics-card-icon purple">

                            <FaGraduationCap />

                        </div>

                        <div>

                            <h3>
                                {stats.education}
                            </h3>

                            <p>
                                Total Education
                            </p>

                        </div>

                    </div>


                    {/* EXPERIENCE */}

                    <div className="analytics-card">

                        <div className="analytics-card-icon orange">

                            <FaBriefcase />

                        </div>

                        <div>

                            <h3>
                                {stats.experience}
                            </h3>

                            <p>
                                Total Experience
                            </p>

                        </div>

                    </div>


                    {/* SKILLS */}

                    <div className="analytics-card">

                        <div className="analytics-card-icon cyan">

                            <FaCode />

                        </div>

                        <div>

                            <h3>
                                {stats.skills}
                            </h3>

                            <p>
                                Total Skills
                            </p>

                        </div>

                    </div>


                    {/* PROJECTS */}

                    <div className="analytics-card">

                        <div className="analytics-card-icon red">

                            <FaProjectDiagram />

                        </div>

                        <div>

                            <h3>
                                {stats.projects}
                            </h3>

                            <p>
                                Total Projects
                            </p>

                        </div>

                    </div>


                    {/* CERTIFICATIONS */}

                    <div className="analytics-card">

                        <div className="analytics-card-icon yellow">

                            <FaCertificate />

                        </div>

                        <div>

                            <h3>
                                {stats.certifications}
                            </h3>

                            <p>
                                Total Certifications
                            </p>

                        </div>

                    </div>


                    {/* LANGUAGES */}

                    <div className="analytics-card">

                        <div className="analytics-card-icon teal">

                            <FaLanguage />

                        </div>

                        <div>

                            <h3>
                                {stats.languages}
                            </h3>

                            <p>
                                Total Languages
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================
                    INDIVIDUAL RESUME ANALYTICS
                ================================= */}

                <div className="resume-analytics-section">

                    <h2>
                        Analytics By Resume
                    </h2>

                    <p className="resume-analytics-subtitle">

                        View detailed information for
                        each resume.

                    </p>


                    {resumes.length === 0 ? (

                        <div className="no-resumes">

                            <FaFileAlt />

                            <h3>
                                No Resumes Found
                            </h3>

                            <p>
                                Create your first resume
                                to see analytics.
                            </p>

                        </div>

                    ) : (

                        <div className="resume-analytics-grid">

                            {resumes.map((resume) => (

                                <div
                                    className="resume-analytics-card"
                                    key={resume.id}
                                >


                                    {/* CARD HEADER */}

                                    <div className="resume-card-header">

                                        <div className="resume-card-icon">

                                            <FaFileAlt />

                                        </div>

                                        <div>

                                            <h3>

                                                Resume {
                                                    resume.resumeNumber
                                                }

                                            </h3>

                                            <p>

                                                {resume.fullName ||
                                                    resume.name}

                                            </p>

                                        </div>

                                    </div>


                                    {/* PROFILE COMPLETION */}

                                    <div className="resume-completion">

                                        <div className="completion-header">

                                            <span>
                                                Profile Completion
                                            </span>

                                            <strong>
                                                {
                                                    resume.profileCompletion
                                                }%
                                            </strong>

                                        </div>


                                        <div className="resume-progress-track">

                                            <div
                                                className="resume-progress-fill"
                                                style={{
                                                    width:
                                                        `${resume.profileCompletion}%`
                                                }}
                                            ></div>

                                        </div>

                                    </div>


                                    {/* SECTIONS */}

                                    <div className="resume-section-stats">


                                        <div>

                                            <FaGraduationCap />

                                            <span>
                                                Education
                                            </span>

                                            <strong>
                                                {
                                                    resume.education
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <FaBriefcase />

                                            <span>
                                                Experience
                                            </span>

                                            <strong>
                                                {
                                                    resume.experience
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <FaCode />

                                            <span>
                                                Skills
                                            </span>

                                            <strong>
                                                {
                                                    resume.skills
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <FaProjectDiagram />

                                            <span>
                                                Projects
                                            </span>

                                            <strong>
                                                {
                                                    resume.projects
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <FaCertificate />

                                            <span>
                                                Certifications
                                            </span>

                                            <strong>
                                                {
                                                    resume.certifications
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <FaLanguage />

                                            <span>
                                                Languages
                                            </span>

                                            <strong>
                                                {
                                                    resume.languages
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* VIEW RESUME */}

                                    <button
                                        className="view-resume-btn"
                                        onClick={() => {

                                            localStorage.setItem(
                                                "personalId",
                                                resume.id
                                            );

                                            navigate(
                                                `/preview/${resume.id}`
                                            );

                                        }}
                                    >

                                        View Resume

                                    </button>


                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}


export default Analytics;