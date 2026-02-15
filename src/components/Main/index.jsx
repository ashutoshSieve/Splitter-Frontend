import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Form from "../Form"; 
import Items from "../Items";
const API = process.env.REACT_APP_API_BASE_URL;

function Main() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleCommunityClick = (communityName) => {
    navigate(`/community/${communityName}`);
  };

  useEffect(() => {
    fetch(`${API}/user`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.redirect) {
            window.location.href = data.redirect;
        }
        if (data.name) {
          setUser(data);
        } else {
          console.error("User not found");
        }
      })
      .catch((err) => console.error("Authentication error:", err));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="main-container">
        <div className="sidebar">
          <button className="open-form-btn" onClick={() => setShowForm(true)}>+</button>
          <h3>Communities</h3>
          {Array.isArray(user?.community) && user.community.length > 0 ? (
            <ul>
              {user.community.map((comm, index) => (
                <li key={index} onClick={() => handleCommunityClick(comm)}      className="community-link">
                  {comm}
                </li>
              ))}
            </ul>
          ) : (
            <p>No communities joined.</p>
          )}

        </div>

        <div className="main-content">
          <h3>{user ? `Welcome, ${user.name}` : "Loading..."}</h3>
          <p>{user ? user.date : "Loading..."}</p>
          <a href="/transaction" className="transaction-link">Transaction History</a>
          <Items />
        </div>
      </div>

      <Footer />

        {showForm && (
          <div className="popup-overlay">
            <div className="popup">
              <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
              <Form onCommunityCreated={() => window.location.reload()} />
            </div>
          </div>
        )}
    </div>
  );
}

export default Main;

