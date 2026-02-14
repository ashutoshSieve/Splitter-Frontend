import React from "react";
import "./style.css";
import Footer from "../Footer";

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <img 
          src="assets/img2.png" 
          alt="Money Splitting" 
          className="home-image"
        />
        <h1 className="home-title">Simplify Your Expenses</h1>
        <p className="home-text">
          Easily split bills and track shared expenses with your friends, family, or roommates. Say goodbye to payment confusion!
        </p>
        <div className="home-buttons">
          <a href="/login" className="home-button">Login</a>
          <a href="/signup" className="home-button">Signup</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
