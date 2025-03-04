import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "../comp/Userjobdetails.css";
import { motion } from "framer-motion";

const UserJobDetails = () => {
  const [jobData, setJobData] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/getbyid/${id}`)
      .then((res) => {
        setJobData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching job details:", error);
      });
  }, [id]);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

      } catch (error) {
        console.error("Error parsing user data from cookies:", error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/getbyapplied")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAppliedJobs(res.data);
        } else {
          console.error("Invalid applied jobs data format:", res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching applied jobs:", error);
      });
  }, []);

  const handleBack = () => {
    navigate("/userhome");
  };

  const handleApply = (id, role) => {
    navigate(`/userapply/${id}/${role}`);
  };

  if (!jobData) {
    return <div className="loading-container">Loading job details...</div>;
  }

  const hasApplied = appliedJobs.some((job) => job.userid === user._id && job.jobid === jobData._id);

  return (
    <motion.div className="job-details-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="job-cardm">
        <div className="job-header">
          <motion.button className="back-btn" onClick={handleBack} whileHover={{ scale: 1.1 }}>
            <i className="fa-regular fa-circle-left fa-xl"></i>
          </motion.button>
          <h1 className="job-title">{jobData.role}</h1>
          <h3 className="company-name">{jobData.companyname}</h3>
        </div>

        <div className="job-info">
          <p><strong>Location:</strong> {jobData.companylocation || "Not specified"}</p>
          <p><strong>Salary:</strong> {jobData.sal || "Not specified"}</p>
          <p><strong>Experience Required:</strong> {jobData.exp || "Not specified"}</p>
          <p><strong>Work Location:</strong> {jobData.worklocation || "Not specified"}</p>
          <p><strong>Contact:</strong> {jobData.contact || "Not provided"}</p>
          <p><strong>Job Type:</strong> {jobData.jobtype || "Full-time"}</p>
        </div>

        <div className="skills-section">
          <strong>Required Skills:</strong>
          <div className="skills-list">
            {jobData.skills?.length > 0 ? (
              jobData.skills.map((skill, index) => (
                <span key={index} className="skill-chip" style={{ backgroundColor: "#007bff", color: "white" }}>{skill}</span>
              ))
            ) : (
              <span className="no-skills">No specific skills mentioned</span>
            )}
          </div>
        </div>

        <motion.div className="job-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2>Company Overview</h2>
          {jobData.companyoverview && (
            <p style={{ textAlign: "justify", lineHeight:"25px" }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: jobData.companyoverview.replace(/\n/g, "<br />"),
                }}
              />
            </p>
          )}

          <h2 style={{marginTop:"15px"}}>Job Description</h2>
          {jobData.joboverview && (
            <p style={{ textAlign: "justify", lineHeight:"25px" }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: jobData.joboverview.replace(/\n/g, "<br />"),
                }}
              />
            </p>
          )}

          <h2 style={{marginTop:"15px"}}>Key Responsibilities</h2>
          <ul style={{ lineHeight: "25px" }}>
            {jobData.keyresponsibilities?.length > 0 ? (
              jobData.keyresponsibilities.map((responsibility, index) => (
                <li key={index}>{responsibility}</li>
              ))
            ) : (
              <li>No responsibilities mentioned</li>
            )}
          </ul>
          <h2 style={{ marginTop: "15px" }}>Required Skills & Qualifications</h2>
          <ul style={{ lineHeight: "25px" }}>
            {jobData?.requiredskills?.length > 0 ? (
              jobData.requiredskills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))
            ) : (
              <li>No qualifications mentioned</li>
            )}
          </ul>
        </motion.div>

        {hasApplied ? (
          <div className="application-status applied">
            <span className="apply-btn applied">Already Applied</span>
          </div>
        ) : (
          <motion.button className="apply-btn" onClick={() => handleApply(jobData._id, jobData.role)} whileHover={{ scale: 1.1 }}>
            Apply Now
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default UserJobDetails;
