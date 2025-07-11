import React, { useState } from "react";
import "./style.css";

function Form({ onCommunityCreated }) {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({ name: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch("https://tight-adorne-pulsekein-43f4bedf.koyeb.app/createCommunity", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({ name: formData.name }),
          });

          const data = await response.json();
          // console.log("Response:", data, "Status:", response.status);

          setMessage(data.message);
          if (response.status === 201) {
              onCommunityCreated();
              setFormData({ name: "" });
          }
      } catch (error) {
          console.error("Fetch error:", error);
          setMessage("Something went wrong. Please try again.");
      }
  };



  return (
    <div className="form-container">
      <h3 className="form-heading">Create Community</h3>
      {message && <p className="form-message">{message}</p>}
      <form className="form-box" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          className="form-input"
          placeholder="Community Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <button type="submit" className="form-button">Create</button>
      </form>
    </div>
  );
}

export default Form;
