import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "../comp/Userapply.css";
import Cookies from "js-cookie";
import axios from 'axios';

const Userapply = () => {
    let navigate = useNavigate();
    const { id, role } = useParams();

    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        jobid: id || "",
        adminid: "",
        userid: "",
        fullname: "",
        phno: "",
        role: role || "",
        companyname: "",
        resume: null  // Change from "" to null for file
    });

    useEffect(() => {
        if (id) {
            setFormData(prev => ({ ...prev, jobid: id }));
            axios.get(`http://localhost:5000/getbyid/${id}`)
                .then(res => {
                    setFormData(prev => ({ ...prev, adminid: res.data.userid, companyname: res.data.companyname }));
                })
                .catch(err => console.error("Error fetching job details:", err));
        }
    }, [id]);

    useEffect(() => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.token) {
                    setUser(parsedUser);
                    const name = `${parsedUser.lastName} ${parsedUser.firstName}`;
                    setFormData(prev => ({
                        ...prev,
                        userid: parsedUser._id,
                        fullname: name,
                        phno: parsedUser.phno
                    }));

                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error parsing user data from cookies:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    console.log(formData);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, resume: e.target.files[0] }));  // Store file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            formData.jobid !== "" &&
            formData.role !== "" &&
            formData.userid !== "" &&
            formData.fullname !== "" &&
            formData.phno !== "" &&
            formData.resume !== null
        ) {
            let FD = new FormData();
            for (let key in formData) {
                FD.append(key, formData[key]);
            }

            try {
                const res = await axios.post("http://localhost:5000/applyjob", FD, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert(res.data.msg);
                if (res.data.msg === "Job Applied..") {
                    const subject = "Application Received – Thank You for Applying";
                    const text = `Dear ${formData.fullname},

Thank you for applying for the ${formData.role} position at ${formData.companyname}. We have received your application and are currently reviewing your qualifications.

Our team will carefully assess your application, and if your profile matches our requirements, we will contact you for the next steps.

We appreciate your interest in joining our team and wish you the best of luck!

Best regards,
Smart-Hire.`;

                    await axios.post("http://localhost:5000/api/mail/send", { to: formData.userid, subject, text });
                }
                console.log(res.data);
                navigate("/userhome");
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("Error applying for the job. Please try again.");
            }
        } else {
            alert("Fill all the details");
        }
    };

    return (
        <div className='mainapplyu'>
            <div className="form-container">
                <h2>Job Application Form</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email (User ID)</label>
                        <input
                            type="text"
                            id="email"
                            name="userid"
                            value={formData.userid}
                            onChange={handleChange}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phno"
                            value={formData.phno}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="resume">Resume or CV</label>
                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Apply
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Userapply;