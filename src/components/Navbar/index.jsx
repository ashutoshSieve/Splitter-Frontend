import React, { useState } from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch("https://splitter-backend-p26d.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token"); 
        sessionStorage.clear();
        navigate("/login"); 
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">Splitter</div>
      
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰ {/* Hamburger icon */}
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><a href="/">Home</a></li>
        <li><a href="/main">Main</a></li>
      </ul>

      <div className="auth-buttons">
        <button className="nav-button login" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
