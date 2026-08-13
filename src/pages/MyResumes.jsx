import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaFileAlt,
    FaEye,
    FaEdit,
    FaTrash
} from "react-icons/fa";

import api from "../service/api";
import "./MyResumes.css";

function MyResumes() {

    const navigate = useNavigate();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!userId) {
            setLoading(false);
            return;
        }

        api.get(`/personal/user/${userId}`)
            .then(res => {

                setResumes(res.data);

            })
            .catch(error => {

                console.error(
                    "Failed to load resumes:",
                    error
                );

            })
            .finally(() => {

                setLoading(false);

            });

    }, [navigate]);


    const previewResume = (resume) => {

        localStorage.setItem(
            "personalId",
            resume.id
        );

        navigate("/resume");

    };


    const editResume = (resume) => {

        localStorage.setItem(
            "personalId",
            resume.id
        );

        navigate("/personal");

    };


    const deleteResume = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this resume?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                `/personal/${id}`
            );

            setResumes(
                resumes.filter(
                    resume => resume.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            alert(
                "Unable to delete resume."
            );

        }

    };


    return (

        <div className="my-resumes-page">

            {/* Header */}

            <div className="my-resumes-header">

                <button
                    className="back-dashboard-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >

                    <FaArrowLeft />

                    Dashboard

                </button>

                <div className="page-title">

                    <FaFileAlt />

                    <h1>
                        My Resumes
                    </h1>

                </div>

            </div>


            {/* Content */}

            <div className="my-resumes-container">

                {loading ? (

                    <div className="loading-box">

                        <h3>
                            Loading resumes...
                        </h3>

                    </div>

                ) : resumes.length === 0 ? (

                    <div className="empty-resumes">

                        <FaFileAlt />

                        <h2>
                            No Resumes Found
                        </h2>

                        <p>
                            You haven't created any resumes yet.
                        </p>

                        <button
                            className="create-resume-btn"
                            onClick={() =>
                                navigate("/personal")
                            }
                        >

                            Create Resume

                        </button>

                    </div>

                ) : (

                    <div className="resume-list">

                        {resumes.map((resume) => (

                            <div
                                className="resume-card"
                                key={resume.id}
                            >

                                <div className="resume-info">

                                    <div className="resume-icon">

                                        <FaFileAlt />

                                    </div>

                                    <div>

                                        <h2>
                                            {resume.firstName}{" "}
                                            {resume.lastName}
                                        </h2>

                                        <p>
                                            {resume.email}
                                        </p>

                                        <span>
                                            Resume ID: #{resume.id}
                                        </span>

                                    </div>

                                </div>


                                <div className="resume-actions">

                                    <button
                                        className="resume-preview-btn"
                                        onClick={() =>
                                            previewResume(resume)
                                        }
                                    >

                                        <FaEye />

                                        Preview

                                    </button>


                                    <button
                                        className="resume-edit-btn"
                                        onClick={() =>
                                            editResume(resume)
                                        }
                                    >

                                        <FaEdit />

                                        Edit

                                    </button>


                                    <button
                                        className="resume-delete-btn"
                                        onClick={() =>
                                            deleteResume(resume.id)
                                        }
                                    >

                                        <FaTrash />

                                        Delete

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default MyResumes;