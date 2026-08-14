import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaSignal,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import api from "../service/api";


import "./Skills.css";

function Skills() {

  const navigate = useNavigate();

  const personalId = localStorage.getItem("personalId");

  const [skills, setSkills] = useState([]);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({

    skill: "",

    level: "Intermediate"

  });

 useEffect(() => {

    if (!personalId) return;

    api.get(`/skills/personal/${personalId}`)
        .then(res => {

            const data = res.data.map(skill => ({
                id: skill.id,
                skill: skill.skillName,
                level: skill.level || "Intermediate"
            }));

            setSkills(data);

        })
        .catch(err => console.log(err));

}, [personalId]);

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  const addSkill = () => {

    if(form.skill.trim()===""){

      alert("Enter Skill");

      return;

    }

    if(editId){

      const updated = skills.map((item)=>

        item.id===editId

        ? { ...form,id:editId }

        : item

      );

      setSkills(updated);

      setEditId(null);

    }

    else{

      setSkills([

        ...skills,

        {

          id:Date.now(),

          ...form

        }

      ]);

    }

    setForm({

      skill:"",

      level:"Intermediate"

    });

  };
  const editSkill = (item) => {

    setForm(item);

    setEditId(item.id);

  };

  const deleteSkill = (id) => {

    const updated = skills.filter(
      (item) => item.id !== id
    );

    setSkills(updated);

  };

  const saveSkills = async () => {

    if (skills.length === 0) {

        alert(
            "Please add at least one skill."
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


    try {

        const savedSkills = [];


        for (const item of skills) {

            const data = {

                skillName: item.skill,

                level: item.level,

                personal: {

                    id: Number(personalId)

                }

            };


            let response;


            // Existing database record

            if (
                item.id &&
                Number(item.id) < 1000000000000
            ) {

                response = await api.put(
                    `/skills/${item.id}`,
                    data
                );

            }


            // New frontend record

            else {

                response = await api.post(
                    "/skills",
                    data
                );

            }


            savedSkills.push(
                response.data
            );

        }


        // Replace temporary IDs with database IDs

        const finalData =
            savedSkills.map((item) => ({

                id: item.id,

                skill: item.skillName || "",

                level:
                    item.level || "Intermediate"

            }));


        setSkills(finalData);


        // Backup

        localStorage.setItem(
            "skills",
            JSON.stringify(finalData)
        );


        console.log(
            "Skills saved successfully:",
            finalData
        );


        navigate("/projects");

    }

    catch (error) {

        console.error(
            "Failed to save skills:",
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
            "Failed to save skills."
        );

    }

};

  return (

    <div className="skills-page">

      <div className="skills-card">

        <h2>Skills</h2>

        <p>Step 4 of 8</p>

        <div className="progress mb-4">

          <div
            className="progress-bar bg-primary"
            style={{ width: "50%" }}
          ></div>

        </div>

        {/* Skill Name */}

        <div className="input-box">

          <FaTools className="input-icon"/>

          <input
            type="text"
            name="skill"
            placeholder="Enter Skill"
            value={form.skill}
            onChange={handleChange}
          />

        </div>

        {/* Skill Level */}

        <div className="input-box">

          <FaSignal className="input-icon"/>

          <select
            name="level"
            className="form-select"
            value={form.level}
            onChange={handleChange}
          >

            <option>Beginner</option>

            <option>Intermediate</option>

            <option>Advanced</option>

            <option>Expert</option>

          </select>

        </div>

        <button
          className="add-btn"
          onClick={addSkill}
        >

          <FaPlus />

          {editId
            ? " Update Skill"
            : " Add Skill"}

        </button>

        <hr />

        {/* Skills List */}

        {

          skills.length===0 ?

          (

            <div className="empty-box">

              <h4>No Skills Added</h4>

            </div>

          )

          :

          <div className="skills-list">

            {

              skills.map((item)=>(

                <div
                  key={item.id}
                  className="skill-item"
                >

                  <div>

                    <h5>{item.skill}</h5>

                    <span className="skill-level">

                      {item.level}

                    </span>

                  </div>

                  <div>

                    <button
                      className="edit-btn"
                      onClick={() => editSkill(item)}
                    >

                      <FaEdit/>

                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteSkill(item.id)}
                    >

                      <FaTrash/>

                    </button>

                  </div>

                </div>

              ))

            }

          </div>

        }

        <div className="button-group">

          <button
            className="back-btn"
            onClick={() => navigate("/experience")}
          >
            Back
          </button>

          <button
            className="next-btn"
            onClick={saveSkills}
          >
            Save & Next
          </button>

        </div>

      </div>

    </div>

  );

}

export default Skills;