import React, { useState, useEffect } from 'react';
import '../comp/Home.css';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Cookies from "js-cookie";

const Home = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data from cookies:", error);
      }
    }
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to <i className="fa-brands fa-slack" id='colorchnge' style={{ color: "white" }}></i> <span id='colorchnge'>Smart-Hire</span></h1>
          <p>Find your dream job or hire top talents easily. Our platform connects job seekers with recruiters to simplify the hiring process.</p>
          <div className="cta-buttons">
            {!user.token ? (
              <>
                <Link to="/signup" className="cta-button">Sign Up</Link>
                <Link to="/login" className="cta-button secondary">Login</Link>
              </>
            ) : null}
          </div>
        </div>
        <div className="hero-image">
          <img src={"https://img.freepik.com/free-vector/hand-drawn-remote-recruitment-illustration_52683-143689.jpg?ga=GA1.1.353791700.1739702045&semt=ais_hybrid"} alt="Hero" />
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 style={{ color: "black" }}>Why Choose Smart-Hire?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src={"https://img.freepik.com/free-vector/flat-employment-agency-search-new-employees-hire_88138-802.jpg?ga=GA1.1.353791700.1739702045&semt=ais_hybrid"} alt="Feature 1" />
            <h3>Personalized Job Matches</h3>
            <p>Get job recommendations tailored to your skills and preferences.</p>
          </div>
          <div className="feature-card">
            <img src={"https://img.freepik.com/free-vector/recruit-agent-analyzing-candidates_74855-4565.jpg?ga=GA1.1.353791700.1739702045&semt=ais_hybrid"} alt="Feature 2" />
            <h3>Real-Time Application Tracking</h3>
            <p>Track your job applications and receive updates in real-time.</p>
          </div>
          <div className="feature-card">
            <img src={"https://img.freepik.com/free-vector/business-leader-consulting-hr-expert_1262-21207.jpg?ga=GA1.1.353791700.1739702045&semt=ais_hybrid"} alt="Feature 3" />
            <h3>Expert Career Guidance</h3>
            <p>Access career advice and interview tips from industry experts.</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="about-section">
        <h2 style={{ color: "black" }}>About Us</h2>
        <p>We are committed to bridging the gap between job seekers and employers. Our mission is to provide a seamless hiring experience with the latest job openings and career guidance.</p>
        <p>Our platform is designed to empower professionals by giving them access to top job opportunities and career growth resources. Whether you are a fresh graduate or an experienced professional, we have something for everyone.</p>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works">
        <h2 style={{ color: "black" }}>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <span>1</span>
            <h3>Sign Up</h3>
            <p>Create your professional profile in minutes.</p>
          </div>
          <div className="step">
            <span>2</span>
            <h3>Apply for Jobs</h3>
            <p>Search and apply for jobs that match your expertise.</p>
          </div>
          <div className="step">
            <span>3</span>
            <h3>Upload Resume</h3>
            <p>Highlight your skills and experience.</p>
          </div>
          <div className="step">
            <span>4</span>
            <h3>Get Hired</h3>
            <p>Connect with recruiters and land your dream job.</p>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <h2>Follow Us</h2>
        <div className="social-icons">
          <Link to="" className="social-icon"><FaFacebook /></Link>
          <Link to="" className="social-icon"><FaTwitter /></Link>
          <Link to="" className="social-icon"><FaLinkedin /></Link>
          <Link id='insta' to="" className="social-icon"><FaInstagram /></Link>
        </div>
        <p style={{ color: "white" }}>&copy; 2025 Smart-Hire. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;