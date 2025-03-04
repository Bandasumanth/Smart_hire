import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Ensure you have this CSS file for styling

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ _id: "", pwd: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check cookies when component mounts
  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      navigate("/addpost");
    }
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  // Validate input fields
  const validateFields = () => {
    let newErrors = {};
    if (!formData._id.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors._id = "Enter a valid email.";
    }
    if (formData.pwd.length < 8) {
      newErrors.pwd = "Password must be at least 8 characters long.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setMessage("Please fill all Fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      const data = response.data;
      if (data.token !== undefined) {
        Cookies.set("user", JSON.stringify(data), { expires: 1 });
        if (data.role === "admin") {
          setMessage("Login successful!");
          navigate("/adhome");
        } else {
          setMessage("Login successful!");
          navigate("/userhome");
        }
      } else {
        setMessage(data.msg);
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mainlog">
      <div className="login-container">
        <div className="login-left">
          <img src="https://img.freepik.com/premium-vector/online-recruitment-headhunting-agency_268404-43.jpg?w=740" alt="Login" />
          <h2>Welcome Back!</h2>
          <p style={{color:"black"}}>Log in to access your account.</p>
        </div>
        <div className="login-right">
          <h2 style={{color:"black"}}>Login</h2>
          {message && <div className="alert-message">{message}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">
                <FaEnvelope style={{ color: "blue" }} /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="_id"
                placeholder="you@example.com"
                value={formData._id}
                onChange={handleChange}
                className={errors._id ? "input-error" : ""}
                style={{width:"310px"}}
              />
              {errors._id && <span className="error-message">{errors._id}</span>}
            </div>
            <div className="input-group">
              <label htmlFor="password">
                <FaLock  style={{color:"blue"}}/> Password
              </label>
              <input
                type="password"
                id="password"
                name="pwd"
                placeholder="Enter 6 characters or more"
                value={formData.pwd}
                onChange={handleChange}
                className={errors.pwd ? "input-error" : ""}
              />
              {errors.pwd && <span className="error-message">{errors.pwd}</span>}
            </div>
            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <p style={{marginTop:"10px",fontFamily:"-moz-initial", display:"flex", justifyContent:"space-between"}}><Link to="/forgotpassword">Forgotten Password</Link><Link to="/signup">Signup</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;