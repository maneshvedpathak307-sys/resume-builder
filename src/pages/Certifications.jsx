import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCertificate,
  FaBuilding,
  FaCalendarAlt,
  FaIdCard,
  FaLink,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import api from "../service/api";

import "./Certifications.css";

function Certifications() {

  const navigate = useNavigate();
    const personalId = localStorage.getItem("personalId");

  const [certifications, setCertifications] = useState([]);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({

    certificate: "",

    organization: "",

    issueDate: "",

    certificateId: "",

    certificateUrl: ""

  });

 useEffect(() => {

    if (!personalId) return;

    api.get(`/certifications/personal/${personalId}`)
        .then(res => {

            const data = res.data.map(item => ({

                id: item.id,
                certificate: item.certificationName,
                organization: item.organization,
                issueDate: item.issueDate,
                certificateId: item.certificateId || "",
                certificateUrl: item.certificateUrl || ""

            }));

            setCertifications(data);

        })
        .catch(err => console.log(err));

}, [personalId]);

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  const addCertification = () => {

    if (

      form.certificate.trim() === "" ||

      form.organization.trim() === ""

    ) {

      alert("Certificate Name and Organization are required.");

      return;

    }

    if (editId) {

      const updated = certifications.map((item) =>

        item.id === editId

          ? { ...form, id: editId }

          : item

      );

      setCertifications(updated);

      setEditId(null);

    } else {

      setCertifications([

        ...certifications,

        {

          id: Date.now(),

          ...form

        }

      ]);

    }

    setForm({

      certificate: "",

      organization: "",

      issueDate: "",

      certificateId: "",

      certificateUrl: ""

    });

  };
  const editCertification = (item) => {

    setForm(item);

    setEditId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  const deleteCertification = async (id) => {

  try {

    // Database ID
    const isDatabaseId =
      Number(id) < 1000000000000;

    // Delete from database
    if (isDatabaseId) {

      await api.delete(
        `/certifications/${id}`
      );

    }

    // Delete from React state
    setCertifications((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    // If currently editing this certification
    if (editId === id) {

      setEditId(null);

      setForm({
        certificate: "",
        organization: "",
        issueDate: "",
        certificateId: "",
        certificateUrl: ""
      });

    }

  } catch (error) {

    console.error(
      "Failed to delete certification:",
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
      "Failed to delete certification."
    );

  }

};

  const saveCertifications = async () => {

    if (certifications.length === 0) {

        alert("Please add at least one certification.");
        return;

    }

    try {

        for (const item of certifications) {

            const data = {

                certificationName: item.certificate,
                organization: item.organization,
                issueDate: item.issueDate,
                certificateId: item.certificateId,
                certificateUrl: item.certificateUrl,

                personal: {
                    id: Number(personalId)
                }

            };

            if (item.id && item.id > 1000000000) {

                await api.post("/certifications", data);

            } else {

                await api.put(`/certifications/${item.id}`, data);

            }

        }

        navigate("/languages");

    } catch (error) {

        console.error(error);

        alert("Failed to save certifications.");

    }

};

  return (

    <div className="certifications-page">

      <div className="certifications-card">

        <h2>Certifications</h2>

        <p>Step 6 of 8</p>

        <div className="progress mb-4">

          <div
            className="progress-bar bg-primary"
            style={{ width: "75%" }}
          ></div>

        </div>

        {/* Certificate Name */}

        <div className="input-box">

          <FaCertificate className="input-icon"/>

          <input
            type="text"
            name="certificate"
            placeholder="Certificate Name"
            value={form.certificate}
            onChange={handleChange}
          />

        </div>

        {/* Organization */}

        <div className="input-box">

          <FaBuilding className="input-icon"/>

          <input
            type="text"
            name="organization"
            placeholder="Issuing Organization"
            value={form.organization}
            onChange={handleChange}
          />

        </div>

        {/* Issue Date */}

        <div className="input-box">

          <FaCalendarAlt className="input-icon"/>

          <input
            type="date"
            name="issueDate"
            value={form.issueDate}
            onChange={handleChange}
          />

        </div>

        {/* Certificate ID */}

        <div className="input-box">

          <FaIdCard className="input-icon"/>

          <input
            type="text"
            name="certificateId"
            placeholder="Certificate ID (Optional)"
            value={form.certificateId}
            onChange={handleChange}
          />

        </div>

        {/* Certificate URL */}

        <div className="input-box">

          <FaLink className="input-icon"/>

          <input
            type="url"
            name="certificateUrl"
            placeholder="Certificate URL"
            value={form.certificateUrl}
            onChange={handleChange}
          />

        </div>

        <button
          className="add-btn"
          onClick={addCertification}
        >

          <FaPlus />

          {editId
            ? " Update Certification"
            : " Add Certification"}

        </button>

        <hr />

        {/* Certification List */}

        {

          certifications.length === 0 ?

          (

            <div className="empty-box">

              <h4>No Certifications Added</h4>

            </div>

          )

          :

          certifications.map((item) => (

            <div
              key={item.id}
              className="certification-item"
            >

              <div>

                <h4>{item.certificate}</h4>

                <p>

                  <strong>Organization:</strong>

                  {" "}

                  {item.organization}

                </p>

                <p>

                  <strong>Issue Date:</strong>

                  {" "}

                  {item.issueDate}

                </p>

                {

                  item.certificateId && (

                    <p>

                      <strong>ID:</strong>

                      {" "}

                      {item.certificateId}

                    </p>

                  )

                }

                {

                  item.certificateUrl && (

                    <p>

                      <strong>Certificate:</strong>

                      {" "}

                      <a
                        href={item.certificateUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Certificate
                      </a>

                    </p>

                  )

                }

              </div>

              <div>

                <button
                  className="edit-btn"
                  onClick={() => editCertification(item)}
                >

                  <FaEdit />

                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteCertification(item.id)}
                >

                  <FaTrash />

                </button>

              </div>

            </div>

          ))

        }

        <div className="button-group">

          <button
            className="back-btn"
            onClick={() => navigate("/projects")}
          >
            Back
          </button>

          <button
            className="next-btn"
            onClick={saveCertifications}
          >
            Save & Next
          </button>

        </div>

      </div>

    </div>

  );

}

export default Certifications;