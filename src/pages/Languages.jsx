import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLanguage,
  FaSignal,
  FaPlus,
  FaEdit,
  FaTrash
} from "react-icons/fa";
import api from "../service/api";

import "./Languages.css";

function Languages() {

  const navigate = useNavigate();
    const personalId = localStorage.getItem("personalId");

  const [languages, setLanguages] = useState([]);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({

    language: "",

    level: "Fluent"

  });

  useEffect(() => {

    if (!personalId) return;

    api.get(`/languages/personal/${personalId}`)
        .then(res => {

            const data = res.data.map(item => ({

                id: item.id,
                language: item.languageName,
                level: item.proficiency

            }));

            setLanguages(data);

        })
        .catch(err => console.log(err));

}, [personalId]);
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value

    });

  };

  const addLanguage = () => {

    if(form.language.trim()===""){

      alert("Please enter a language.");

      return;

    }

    if(editId){

      const updated = languages.map((item)=>

        item.id===editId

          ? { ...form,id:editId }

          : item

      );

      setLanguages(updated);

      setEditId(null);

    }

    else{

      setLanguages([

        ...languages,

        {

          id:Date.now(),

          ...form

        }

      ]);

    }

    setForm({

      language:"",

      level:"Fluent"

    });

  };
  const editLanguage = (item) => {

    setForm(item);

    setEditId(item.id);

  };

  const deleteLanguage = async (id) => {

    try {

        const isDatabaseId =
            Number(id) < 1000000000000;

        if (isDatabaseId) {

            await api.delete(
                `/languages/${id}`
            );

        }

        setLanguages(
            languages.filter(
                (item) => item.id !== id
            )
        );

        if (editId === id) {

            setEditId(null);

            setForm({
                language: "",
                level: "Fluent"
            });

        }

    } catch (error) {

        console.error(
            "Failed to delete language:",
            error
        );

        alert(
            "Failed to delete language."
        );

    }
};

  const saveLanguages = async () => {

    if (languages.length === 0) {

        alert("Please add at least one language.");
        return;

    }

    try {

        for (const item of languages) {

            const data = {

                languageName: item.language,
                proficiency: item.level,

                personal: {
                    id: Number(personalId)
                }

            };

            if (
    item.id &&
    Number(item.id) < 1000000000000
) {
    await api.put(
        `/languages/${item.id}`,
        data
    );
} else {
    await api.post(
        "/languages",
        data
    );
}

        }

        navigate("/templates");

    } catch (error) {

        console.error(error);

        alert("Failed to save languages.");

    }

};

  return (

    <div className="languages-page">

      <div className="languages-card">

        <h2>Languages</h2>

        <p>Step 7 of 8</p>

        <div className="progress mb-4">

          <div
            className="progress-bar bg-primary"
            style={{ width: "87.5%" }}
          ></div>

        </div>

        {/* Language */}

        <div className="input-box">

          <FaLanguage className="input-icon"/>

          <input
            type="text"
            name="language"
            placeholder="Language"
            value={form.language}
            onChange={handleChange}
          />

        </div>

        {/* Proficiency */}

        <div className="input-box">

          <FaSignal className="input-icon"/>

          <select
            className="form-select"
            name="level"
            value={form.level}
            onChange={handleChange}
          >

            <option>Basic</option>

            <option>Intermediate</option>

            <option>Fluent</option>

            <option>Native</option>

          </select>

        </div>

        <button
          className="add-btn"
          onClick={addLanguage}
        >

          <FaPlus />

          {editId
            ? " Update Language"
            : " Add Language"}

        </button>

        <hr />

        {/* Languages List */}

        {

          languages.length === 0 ?

          (

            <div className="empty-box">

              <h4>No Languages Added</h4>

            </div>

          )

          :

          <div className="languages-list">

            {

              languages.map((item)=>(

                <div
                  key={item.id}
                  className="language-item"
                >

                  <div>

                    <h5>{item.language}</h5>

                    <span className="language-level">

                      {item.level}

                    </span>

                  </div>

                  <div>

                    <button
                      className="edit-btn"
                      onClick={() => editLanguage(item)}
                    >

                      <FaEdit/>

                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteLanguage(item.id)}
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
            onClick={() => navigate("/certifications")}
          >
            Back
          </button>

          <button
            className="next-btn"
            onClick={saveLanguages}
          >
            Save & Next
          </button>

        </div>

      </div>

    </div>

  );

}

export default Languages;