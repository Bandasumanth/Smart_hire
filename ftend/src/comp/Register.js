import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Reg.css";

const NAME_REGEX = /^[a-zA-Z\s]{4,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6789]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%^#*?&])[A-Za-z\d@$!%^#*?&]{8,}$/;

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phno: "",
    password: "",
    confirmPassword: "",
  });

  const [validation, setValidation] = useState({
    errors: {},
    valid: {},
    emptyFields: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  useEffect(() => {
    validateField("confirmPassword", formData.confirmPassword);
  }, [formData.password]);

  const validateField = useCallback((name, value) => {
    let errorMessage = "";
    let isValid = false;

    switch (name) {
      case "firstName":
      case "lastName":
        isValid = NAME_REGEX.test(value);
        errorMessage = isValid ? "" : "Enter a valid name (at least 4 letters).";
        break;
      case "email":
        isValid = EMAIL_REGEX.test(value);
        errorMessage = isValid ? "" : "Enter a valid email.";
        break;
      case "phno":
        isValid = PHONE_REGEX.test(value);
        errorMessage = isValid ? "" : "Enter a valid 10-digit phone number.";
        break;
      case "password":
        isValid = PASSWORD_REGEX.test(value);
        errorMessage = isValid
          ? ""
          : "Password must be 8+ characters, include upper & lowercase letters, a number, and a special character.";
        break;
      case "confirmPassword":
        isValid = value === formData.password;
        errorMessage = isValid ? "" : "Passwords do not match.";
        break;
      default:
        break;
    }

    setValidation((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: errorMessage },
      valid: { ...prev.valid, [name]: isValid },
    }));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (messageType === "error") setMessage("");

    validateField(name, value);

    setValidation((prev) => ({
      ...prev,
      emptyFields: { ...prev.emptyFields, [name]: false },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emptyFieldsCheck = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === "") {
        emptyFieldsCheck[key] = true;
      }
    });

    if (Object.keys(emptyFieldsCheck).length > 0) {
      setValidation((prev) => ({ ...prev, emptyFields: emptyFieldsCheck }));
      setMessage("All fields are required.");
      setMessageType("error");
      return;
    }

    setValidation((prev) => ({ ...prev, emptyFields: {} }));

    const newErrors = {};
    const newValid = {};

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      let errorMessage = "";
      let isValid = false;

      switch (key) {
        case "firstName":
        case "lastName":
          isValid = NAME_REGEX.test(value);
          errorMessage = isValid ? "" : "Enter a valid name (at least 4 letters).";
          break;
        case "email":
          isValid = EMAIL_REGEX.test(value);
          errorMessage = isValid ? "" : "Enter a valid email.";
          break;
        case "phno":
          isValid = PHONE_REGEX.test(value);
          errorMessage = isValid ? "" : "Enter a valid 10-digit phone number.";
          break;
        case "password":
          isValid = PASSWORD_REGEX.test(value);
          errorMessage = isValid
            ? ""
            : "Password must be 8+ characters, include upper & lowercase letters, a number, and a special character.";
          break;
        case "confirmPassword":
          isValid = value === formData.password;
          errorMessage = isValid ? "" : "Passwords do not match.";
          break;
        default:
          break;
      }

      newErrors[key] = errorMessage;
      newValid[key] = isValid;
    });

    setValidation((prev) => ({ ...prev, errors: newErrors, valid: newValid }));

    const allValid = Object.values(newValid).every((v) => v);

    if (!allValid) {
      setMessage("Please fix errors before submitting.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const otp = generateOtp();
      setGeneratedOtp(otp);


      const response = await axios.post("http://localhost:5000/api/mail/send", {
        to: formData.email,
        subject: "Your Verification OTP",
        text: `Hello! Your OTP for verification is: ${otp}. Use it within 5 minutes for security reasons.`,
    });
    

      if (response.data.message === "Email sent") {
        setMessage("OTP sent to your email.");
        setMessageType("success");
        setShowOtpInput(true);
      } else {
        setMessage("Failed to send OTP. Try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("OTP sending error:", error);
      setMessage("Server error. Please try again later.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      if (otp === generatedOtp) {
        
        let dataToSubmit = {"_id":formData.email,"firstName": formData.firstName,
          "lastName": formData.lastName,
          "phno": formData.phno,
          "pwd":formData.password }
        // const { confirmPassword, ...dataToSubmit } = formData;
        const response = await axios.post("http://localhost:5000/reg", dataToSubmit);

        if (response.data.msg === "Email Already Exist!..") {
          setMessage("Email already exists. Try to Login.");
          setMessageType("error");
        } else if (response.data.msg === "Registration Done") {
          setMessage("Registration successful! Please login.");
          setMessageType("success");
          setTimeout(() => navigate("/login"), 1000);
        } else {
          setMessage("Registration failed. Try again.");
          setMessageType("error");
        }
      } else {
        setMessage("Invalid OTP. Try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setMessage("Server error. Please try again later.");
      setMessageType("error");
    }
  };

  return (
    <div className="mainsignup">
      <div className="signup-container">
        <div className="login-left">
          <img src="https://img.freepik.com/free-vector/man-search-hiring-job-online-from-laptop_1150-52728.jpg?t=st=1739706734~exp=1739710334~hmac=6c208b6fc951fae4d1502428fea5cd6af247e86bde82951de6ff33098631d85d&w=900" alt="Signup" />
          <h2>Welcome!</h2>
          <p style={{color:"black"}}>Create an account to get started.</p>
        </div>
        <div className="login-right">
          <h2 style={{ color: "black" }}>Sign Up</h2>
          {message && (
            <div className={`message-card ${messageType}`}>
              <p>{message}</p>
            </div>
          )}
          {!showOtpInput ? (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="row">
                <div className="input-group">
                  <label>
                    <FaUser style={{ color: "blue" }} /> First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{width:"205px"}}
                    className={
                      validation.emptyFields.firstName
                        ? "input-empty"
                        : validation.errors.firstName
                        ? "input-error"
                        : validation.valid.firstName
                        ? "input-valid"
                        : ""
                    }
                  />
                  {validation.errors.firstName && <span className="errors-message">{validation.errors.firstName}</span>}
                </div>
                <div className="input-group">
                  <label>
                    <FaUser style={{ color: "blue" }} /> Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    style={{width:"205px"}}
                    onChange={handleChange}
                    className={
                      validation.emptyFields.lastName
                        ? "input-empty"
                        : validation.errors.lastName
                        ? "input-error"
                        : validation.valid.lastName
                        ? "input-valid"
                        : ""
                    }
                  />
                  {validation.errors.lastName && <span className="errors-message">{validation.errors.lastName}</span>}
                </div>
              </div>
              <div className="row">
                <div className="input-group">
                  <label>
                    <FaEnvelope style={{ color: "blue" }} /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    style={{width:"230px"}}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={validation.errors.email ? "input-error" : validation.valid.email ? "input-valid" : ""}
                  />
                  {validation.errors.email && <span className="errors-message">{validation.errors.email}</span>}
                </div>
                <div className="input-group">
                  <label>
                    <FaPhone style={{ color: "blue" }} /> Phone
                  </label>
                  <input
                    type="text"
                    name="phno"
                    placeholder="Enter your phone number"
                    value={formData.phno}
                    style={{width:"205px"}}
                    onChange={handleChange}
                    className={validation.errors.phno ? "input-error" : validation.valid.phno ? "input-valid" : ""}
                  />
                  {validation.errors.phno && <span className="errors-message">{validation.errors.phno}</span>}
                </div>
              </div>
              <div className="row">
                <div className="input-group">
                  <label>
                  <FaLock style={{color:"blue"}}/> Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    style={{width:"230px"}}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={validation.errors.password ? "input-error" : validation.valid.password ? "input-valid" : ""}
                  />
                  {validation.errors.password && <span className="errors-message">{validation.errors.password}</span>}
                </div>
                <div className="input-group">
                  <label>
                    <FaLock style={{color:"blue"}}/> Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    style={{width:"230px"}}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={validation.errors.confirmPassword ? "input-error" : validation.valid.confirmPassword ? "input-valid" : ""}
                  />
                  {validation.errors.confirmPassword && <span className="errors-message">{validation.errors.confirmPassword}</span>}
                </div>
              </div>
              <button type="submit" className="login-button" disabled={isSubmitting} >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="login-form">
              <div className="input-group">
                <label>
                  <FaLock style={{ color: "blue" }} /> OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <button type="submit" className="login-button">
                Verify OTP
              </button>
            </form>
          )}
          <p style={{position:"relative",top:"15px", fontFamily:"-moz-initial"}}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;