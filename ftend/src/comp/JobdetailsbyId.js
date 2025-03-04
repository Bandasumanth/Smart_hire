import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../comp/Jobdetails.css"; // Ensure this file is present
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const JobdetailsbyId = () => {
    const [data, setData] = useState(null);
    let navigate = useNavigate();

    const [user, setUser] = useState(null);
    // Load user data from cookies
    useEffect(() => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.token) {
                    setUser(parsedUser);
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

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (user && !user.token) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        axios.get(`http://localhost:5000/getbyid/${id}`).then((res) => {
            setData(res.data)
        })

    }, [])

    let handleBack = () => {
        navigate("/adhome");
    };

    const { id } = useParams();
    console.log(id);

    if (!data) {
        return <h2 className="loading-message" style={{ position: "relative", top: "50px" }}>Loading job details...</h2>;
    }
    return (
        <motion.div className="job-details-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="job-card">
                <div className="job-header">
                    <motion.button className="back-btn" onClick={handleBack} whileHover={{ scale: 1.1 }}>
                        <i className="fa-regular fa-circle-left fa-xl"></i>
                    </motion.button>
                    <h1 className="job-title">{data.role}</h1>
                    <h3 className="company-name">{data.companyname}</h3>
                </div>

                <div className="job-info">
                    <p><strong>Location:</strong> {data.companylocation || "Not specified"}</p>
                    <p><strong>Salary:</strong> {data.sal || "Not specified"}</p>
                    <p><strong>Experience Required:</strong> {data.exp || "Not specified"}</p>
                    <p><strong>Work Location:</strong> {data.worklocation || "Not specified"}</p>
                    <p><strong>Contact:</strong> {data.contact || "Not provided"}</p>
                    <p><strong>Job Type:</strong> {data.jobtype || "Full-time"}</p>
                </div>

                <div className="skills-section">
                    <strong>Required Skills:</strong>
                    <div className="skills-list">
                        {data.skills?.length > 0 ? (
                            data.skills.map((skill, index) => (
                                <span key={index} className="skill-chips">{skill}</span>
                            ))
                        ) : (
                            <span className="no-skills">No specific skills mentioned</span>
                        )}
                    </div>
                </div>

                <motion.div className="job-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h2 style={{marginTop:"10px"}}>Company Overview</h2>
                    {data.companyoverview && (
                                <p style={{textAlign:"justify",lineHeight:"25px"}}>
                                    <span 
                                        dangerouslySetInnerHTML={{
                                            __html: data.companyoverview.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </p>
                            )}

                    <h2 style={{marginTop:"10px"}}>Job Description</h2>
                    {data.joboverview && (
                                <p style={{textAlign:"justify",lineHeight:"25px"}}>
                                    <span 
                                        dangerouslySetInnerHTML={{
                                            __html: data.joboverview.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </p>
                            )}
                    

                    <h2 style={{marginTop:"10px"}}>Key Responsibilities</h2>
                    <ul style={{lineHeight:"25px"}}>
                        {data.keyresponsibilities?.length > 0 ? (
                            data.keyresponsibilities.map((responsibility, index) => (
                                <li key={index}>{responsibility}</li>
                            ))
                        ) : (
                            <li>No responsibilities mentioned</li>
                        )}
                    </ul>
                    <h2 style={{ marginTop: "15px" }}>Required Skills & Qualifications</h2>
                    <ul style={{lineHeight:"25px"}}>
                        {data?.requiredskills?.length > 0 ? (
                            data.requiredskills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))
                        ) : (
                            <li>No qualifications mentioned</li>
                        )}
                    </ul>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default JobdetailsbyId;