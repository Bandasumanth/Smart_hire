import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaKey } from "react-icons/fa";
import "../comp/Forgot.css"
import { useNavigate } from "react-router-dom";

const ForgotPasswordModal = ({ onClose }) => {
    let navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState(""); // Store the generated OTP
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Set New Password
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate a random 6-digit OTP
    const generateOtp = () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        return otp;
    };

    // Send OTP to the user's email
    const handleSendOtp = async () => {
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Please enter a valid email.");
            return;
        }

        setIsSubmitting(true);
        const otp = generateOtp(); // Generate OTP

        try {
            // Send OTP to the backend to email it to the user
            const response = await axios.post("http://localhost:5000/api/mail/send", {
                to: email,
                subject: "Your Verification OTP for Password Reset.",
                text: `Hello! Your OTP for verification is: ${otp}. Use it within 5 minutes for security reasons.`,
            });
            setMessage(response.data.msg);
            setStep(2); // Move to the OTP verification step
        } catch (error) {
            setError("Failed to send OTP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Verify the OTP entered by the user
    const handleVerifyOtp = () => {
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP.");
            return;
        }

        if (otp === generatedOtp) {
            setMessage("OTP verified successfully.");
            setStep(3); // Move to the set new password step
        } else {
            setError("Invalid OTP. Please try again.");
        }
    };

    // Set a new password
    const handleSetNewPassword = async () => {
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Send the new password to the backend to update it
            const response = await axios.post("http://localhost:5000/reset-password", {
                email,
                newPassword,
            });
            setMessage(response.data.msg);
            setTimeout(()=>{
                navigate("/login")
            },1000)
            // Close the modal after successful password reset
        } catch (error) {
            setError("Failed to reset password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="forgot-password-modal">
            <div className="modal-content">
                <h2 style={{ color: "black" }}>Forgot Password</h2>
                {message && <div className="alert-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                {step === 1 && (
                    <div className="input-group">

                        <label htmlFor="email">
                            <FaEnvelope style={{ color: "blue" }} /> Email Address
                        </label>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <button onClick={handleSendOtp} disabled={isSubmitting}>
                                {isSubmitting ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="input-group">
                        <label htmlFor="otp">
                            <FaKey style={{ color: "blue" }} /> Enter OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={handleVerifyOtp} disabled={isSubmitting} style={{marginTop:"20px",padding:"10px 20px"}}>
                            {isSubmitting ? "Verifying OTP..." : "Verify OTP"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="input-group">
                        <label htmlFor="newPassword">
                            <FaKey style={{ color: "blue" }} /> New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button onClick={handleSetNewPassword} disabled={isSubmitting} style={{marginTop:"20px",padding:"10px 20px"}}>
                            {isSubmitting ? "Resetting Password..." : "Set New Password"}
                        </button>
                    </div>
                )}

                <button onClick={() => navigate("/login")} className="close-button">
                    Close
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;