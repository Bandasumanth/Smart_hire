import React, { useEffect, useState } from "react";
import "../comp/Adminhome.css";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../comp/AppliedJobs";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Adminhome = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  // Redirect to login if no valid user token
  useEffect(() => {
    if (user && user.token === undefined) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch job data when user is set
  useEffect(() => {
    if (user && user._id) {
      axios
        .get(`http://localhost:5000/getuserjob/${user._id}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setData(res.data);
          } else {
            console.error("Invalid data format received:", res.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching job data:", error);
        });
    }
  }, [user]);

  // Handle job deletion
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/del/${id}`)
      .then((res) => {
        alert(res.data.msg);
        setData((prevData) => prevData.filter((job) => job._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      });
  };

  // Navigate to job details page
  const getdetails = (id) => {
    navigate(`/jobdetails/${id}`);
  };

  // Navigate to edit job page
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="containers">
      {data.length === 0 ? (
        <h2 className="no-jobs">No jobs available</h2>
      ) : (
        data.map((obj) => (
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
                <button className="apply-button" style={{backgroundColor:"blue"}} onClick={() => handleEdit(obj._id)}>
                <EditIcon />
                </button>
                <button className="del-button" style={{backgroundColor:"red"}} onClick={() => handleDelete(obj._id)}>
                <DeleteIcon sx={{ color: 'white', fontSize: 24 }} />
                </button>
              </div>
            </div>
            <div className="card-details">
              <p style={{marginBottom:"25px"}}><i class="fa-solid fa-location-dot" style={{ color: "#ff0000" }}></i> <strong style={{ fontSize: "15px" }}>{obj.worklocation}</strong></p>
              <p style={{ marginTop: "-18px", display: 'flex', flexWrap:"wrap", gap: "15px", marginBottom:"10px" }}><span>Salary Range: <strong style={{ fontSize: "15px" }}>{obj.sal}</strong></span><span>Experience: <strong style={{ fontSize: "15px" }}>{obj.exp}</strong></span></p>
              {obj.joboverview.slice(0, 142) + "......"}
            </div>
            <div className="skillscont">
              {obj.skills?.map((skill, index) => (
                <div key={index} className="skills" style={{backgroundColor:"blue"}}>
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

export default Adminhome;
