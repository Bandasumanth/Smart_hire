import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "../comp/Appliedjobs.css";
import { motion } from "framer-motion";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [user, setUser] = useState({});
  let navigate = useNavigate();

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

  useEffect(() => {
    if (user._id) {
      axios
        .get("http://localhost:5000/getbyapplied")
        .then((res) => {
          if (Array.isArray(res.data)) {
            const userAppliedJobs = res.data.filter((p) => p.userid === user._id);
            setAppliedJobs(userAppliedJobs);
          } else {
            console.error("Invalid data format received for applied jobs:", res.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching applied jobs:", error);
        });
    }
  }, [user._id]);

  useEffect(() => {
    if (appliedJobs.length > 0) {
      const jobIds = appliedJobs.map((job) => job.jobid);
      axios
        .get("http://localhost:5000/jobdetails")
        .then((res) => {
          if (Array.isArray(res.data)) {
            const jobs = res.data.filter((job) => jobIds.includes(job._id));
            setAppliedJobs(jobs);
          } else {
            console.error("Invalid job details format received:", res.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching job details:", error);
        });
    }
  }, [appliedJobs.length]);

  const getdetails = (id) => {
    navigate(`/userjobdetails/${id}`);
  };

  return (
    <div className="containers">
      {appliedJobs.length === 0 ? (
        <h2
          style={{ position: "relative", left: "40%", marginTop: "50px", textTransform: "uppercase", }}
        >
          No applied jobs found
        </h2>
      ) : (
        appliedJobs.map((obj) => (
          <motion.div
            key={obj._id}
            className="cardz"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          ><div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="card-title" onClick={() => getdetails(obj._id)}>
                {obj.companyname} - {obj.role}
              </div>
              <div className="card-buttonz">
                <button className="apply-button" style={{ backgroundColor: "GrayText" }}>
                  Applied
                </button>
                <a
                        href={`https://api.whatsapp.com/send?text=Check out this job opportunity at ${obj.companyname} for the role of ${obj.role}. Location: ${obj.worklocation}, Salary: ${obj.sal}, Experience Required: ${obj.exp}.For more details click here: ${window.location.origin}/userjobdetails/${obj._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-button"
                        style={{padding:"10px 20px"}}
                      >
                        <i className="fa-brands fa-whatsapp fa-xl"></i>
                      </a>
              </div>
            </div>
            <div className="card-detailz">
              <p style={{marginBottom:"25px"}}>Job available in <strong style={{ fontSize: "15px" }}>{obj.worklocation}</strong></p>
              <p style={{ marginTop: "-18px", display: 'flex', gap: "15px",marginBottom:"15px" }}><span>Salary Range: <strong style={{ fontSize: "15px" }}>{obj.sal}</strong></span><span>Experience: <strong style={{ fontSize: "15px" }}>{obj.exp}</strong></span></p>
              {obj.joboverview ? obj.joboverview.slice(0, 142) + "..." : ""}
            </div>
            <div className="skillscont">
              {obj.skills?.map((skill, index) => (
                <div key={index} className="skillz" style={{ backgroundColor: "blue" }}>
                  {skill}
                </div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default AppliedJobs;
