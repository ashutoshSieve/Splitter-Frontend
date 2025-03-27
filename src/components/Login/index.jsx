import React, { useState, useEffect } from "react";
import Footer from "../Footer";
import "./style.css";

function Login() {

  const [formData, setFormData] = useState({
      email: "",
      password: ""
  });
  const [message, setMessage] = useState(""); 
  
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const response = await fetch("https://splitter-backend-p26d.onrender.com/login", {
              method: "POST",
              credentials: "include",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(formData)
          });

          const data = await response.json();
          setMessage(data.message);

          if (response.ok) { 
              window.location.href = "/main"; 
          }
      } catch (error) {
          setMessage("Something went wrong. Please try again.");
      }
  };

  const handleGoogleLogin = () => {
      window.location.href = "https://splitter-backend-p26d.onrender.com/google";
  };
  
  useEffect(() => {
      fetch("https://splitter-backend-p26d.onrender.com/verify-token", {
          method: "GET",
          credentials: "include" 
      })
      .then(res => res.json())
      .then(data => {
          if (data.success) {
              window.location.href = "/main";
          }
      })
      .catch(err => console.error("Authentication error:", err));
  }, []);
  return (
    <div className="signup-container">
      <div className="signup-card">
        {message && <p className="message">{message}</p>}
        <h1 className="signup-title">Login to Account</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required
          />
          <input type="password" 
                name="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
                required
           />
          <button type="submit" className="signup-button">Login</button>
        </form>
        <p className="signup-text">Or Login with</p>
        <button className="google-button" onClick={handleGoogleLogin}>
          <img src="image/search.png" alt="Google" className="google-icon" />
          Login with Google
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
