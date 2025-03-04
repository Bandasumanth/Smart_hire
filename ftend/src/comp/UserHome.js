import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import "../comp/Userhome.css";

const UserHome = () => {
  const [data, setData] = useState([]);
  const [applieddata, setAppliedData] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "Both internships and full-time",
    skills: "",
    jobFunction: "",
    industries: "",
    locations: "",
    companies: "",
    companySize: "all",
    experience: "",
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsResponse, appliedJobsResponse] = await Promise.all([
          axios.get("http://localhost:5000/jobdetails"),
          axios.get("http://localhost:5000/getbyapplied"),
        ]);

        if (Array.isArray(jobsResponse.data)) {
          setData(jobsResponse.data);
        } else {
          console.error("Invalid data format received:", jobsResponse.data);
          setData([]);
        }

        if (Array.isArray(appliedJobsResponse.data)) {
          setAppliedData(appliedJobsResponse.data);
        } else {
          console.error("Invalid data format received for applied jobs:", appliedJobsResponse.data);
          setAppliedData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

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

  const getdetails = (id) => {
    navigate(`/userjobdetails/${id}`);
  };

  const apply = (id, role) => {
    navigate(`/userapply/${id}/${role}`);
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [id]: value,
    }));
  };

  const filterJobs = (jobs) => {
    return jobs.filter((job) => {
      const matchesJobType =
        filters.type === "Both internships and full-time" ||
        (filters.type === "Internship" && job.type === "Internship") ||
        (filters.type === "Full-time" && job.type === "Full-time");
  
      const matchesSkills =
        !filters.skills ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(filters.skills.toLowerCase())
        );
  
      const matchesLocations =
        !filters.locations ||
        job.worklocation.toLowerCase().includes(filters.locations.toLowerCase());
  
      const matchesJobFunction =
        !filters.jobFunction ||
        job.role.toLowerCase().includes(filters.jobFunction.toLowerCase());
  
      const matchesCompanies =
        !filters.companies ||
        job.companyname.toLowerCase().includes(filters.companies.toLowerCase());
  
      const matchesExperience =
        !filters.experience ||
        job.exp.toString().includes(filters.experience);
  
      return (
        matchesJobType &&
        matchesSkills &&
        matchesJobFunction &&
        matchesLocations &&
        matchesCompanies &&
        matchesExperience
      );
    });
  };

  const filteredData = filterJobs(data);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-home-container">
      <div className="user-home-content">
        <button className="filter-toggle-button" onClick={() => setIsFilterVisible(!isFilterVisible)}>
          {isFilterVisible ? "Hide Filters" : "Show Filters"}
        </button>
        <div className={`filter-section ${isFilterVisible ? "visible" : ""}`}>
          <JobSearchForm filters={filters} onFilterChange={handleFilterChange} jobFunctions={[...new Set(data.map(job => job.role))]} />
        </div>
        <div className="job-list-section">
          {filteredData.length === 0 ? (
            <h2 className="no-jobs-message">No jobs available</h2>
          ) : (
            filteredData
              .filter((obj) => !applieddata.some((p) => p.userid === user._id && p.jobid === obj._id))
              .map((obj) => (
                <motion.div
                  key={obj._id}
                  className="job-card"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="job-card-header">
                    <div className="job-card-title" onClick={() => getdetails(obj._id)}>
                      {obj.companyname} - {obj.role}
                    </div>
                    <div className="job-card-buttons">
                      <button className="apply-button" onClick={() => apply(obj._id, obj.role)}>
                        Apply
                      </button>
                      <a
                        href={`https://api.whatsapp.com/send?text=Check out this job opportunity at ${obj.companyname} for the role of ${obj.role}. Location: ${obj.worklocation}, Salary: ${obj.sal}, Experience Required: ${obj.exp}.For more details click here: ${window.location.origin}/userjobdetails/${obj._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-button"
                        style={{padding:"10px 20px"}}
                      >
                        <i className="fa-brands fa-whatsapp fa-xl" ></i>
                      </a>
                    </div>
                  </div>
                  <div className="job-card-details">
                    <p><i className="fa-solid fa-location-dot"  style={{color:"red"}}></i> <strong>{obj.worklocation}</strong></p>
                    <div style={{display:"flex", flexWrap:"wrap", gap:"10px"}}><p>Salary Range: <strong>{obj.sal}</strong></p><p>Experience: <strong>{obj.exp}</strong></p></div>
                    <p>{obj.joboverview.slice(0, 142) + "......"}</p>
                  </div>
                  <div className="job-card-skills">
                    {obj.skills?.map((skill, index) => (
                      <div key={index} className="skill-tag">
                        {skill}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

const JobSearchForm = ({ filters, onFilterChange, jobFunctions }) => {
  return (
    <div className="job-search-form">
      <h2 style={{fontSize:"20px"}}>Filter by jobs</h2>
      <label htmlFor="type">Job Type</label>
      <select id="type" value={filters.type} onChange={onFilterChange}>
        <option value="Both internships and full-time">Both internships and full-time</option>
        <option value="Internship">Internship</option>
        <option value="Full-time">Full-time</option>
      </select>

      <label htmlFor="skills">Skills</label>
      <input type="text" id="skills" placeholder="Enter skills or title, e.g Java, C++" value={filters.skills} onChange={onFilterChange} />

      <label htmlFor="jobFunction">Job Role</label>
      <select id="jobFunction" value={filters.jobFunction} onChange={onFilterChange}>
        <option value="">Select job functions</option>
        {jobFunctions.map((role, index) => (
          <option key={index} value={role}>{role}</option>
        ))}
      </select>

      <label htmlFor="locations">Locations</label>
      <input type="text" id="locations" placeholder="Select cities e.g. Bangalore, Delhi" value={filters.locations} onChange={onFilterChange} />

      <label htmlFor="companies">Companies</label>
      <input type="text" id="companies" placeholder="Enter companies e.g Amazon" value={filters.companies} onChange={onFilterChange} />

      <label htmlFor="experience">Experience (in years)</label>
      <input type="text" id="experience" placeholder="e.g. 4" value={filters.experience} onChange={onFilterChange} />

      {/* <div className="form-buttons">
        <button onClick={() => {}}>Apply Filters</button>
      </div> */}
    </div>
  );
};

export default UserHome;