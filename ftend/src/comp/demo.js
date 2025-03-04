import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

const Edit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [formdata, setData] = useState({
        role: "",
        exp: "",
        companyname: "",
        userid: "",
        sal: "",
        companyoverview: "",
        joboverview: "",
        keyresponsibilities: [],
        requiredskills: [],
        skills: [],
        worklocation: "",
        companylocation: ""
    });


    // Fetch job details when id changes
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/getbyid/${id}`)
                .then((res) => {
                    setData(res.data); // Set form data from API response
                })
                .catch((err) => console.error("Error fetching job:", err));
        }
    }, [id]);

    // Get user from cookies once on mount
    useEffect(() => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.token) {
                    setUser(parsedUser);
                    setData((prev) => ({ ...prev, userid: parsedUser._id }));
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

    const handleInputChange = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handler for textarea changes (splits text by periods)
    const handleTextareaChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value.trim() ? e.target.value.split(".") : [],
        }));
    };

    // Handler for changes in skills input (splits text by commas)
    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value.trim() ? e.target.value.split(", ") : [],
        }));
    };

    const update = async (e) => {
        e.preventDefault();

        // Validate all required fields
        if (
            formdata.role &&
            formdata.exp &&
            formdata.companyname &&
            formdata.sal &&
            formdata.companyoverview &&
            formdata.joboverview &&
            formdata.keyresponsibilities.length > 0 &&
            formdata.requiredskills.length > 0 &&
            formdata.skills.length > 0 &&
            formdata.worklocation &&
            formdata.companylocation
        ) {
            try {
                // Send PUT request to update the job
                const res = await axios.put(`http://localhost:5000/edit/${formdata._id}`, formdata);
                alert(res.data.msg);

                // Reset form data after successful update
                setData({
                    role: "",
                    exp: "",
                    companyname: "",
                    userid: user._id || "",
                    sal: "",
                    companyoverview: "",
                    joboverview: "",
                    keyresponsibilities: [],
                    requiredskills: [],
                    skills: [],
                    worklocation: "",
                    companylocation: ""
                });

                // Navigate to the home page
                navigate("/adhome");
            } catch (err) {
                console.error("Error updating job:", err);
                alert("Failed to update job. Try again.");
            }
        } else {
            alert("Enter All Required Fields!");
        }
    };

    return (
        <div className="main">
            <div className="addpost-container">
                <div className="addpost-card">
                    <h2 className="addpost-title">Edit the Details</h2>
                    <form className="addpost-form" onSubmit={update}>
                        <div className="addpost-field">
                            <label htmlFor="roleSelect" className="addpost-label">
                                Role
                            </label>
                            <select
                                onChange={handleInputChange}
                                id="roleSelect"
                                name="role"
                                value={formdata.role}
                                className="addpost-select"
                            >
                                <option disabled value="">
                                    -- Select --
                                </option>
                                <option value="Software Engineer">Software Engineer</option>
                                <option value="Frontend Developer">Frontend Developer</option>
                                <option value="Backend Developer">Backend Developer</option>
                                <option value="Full-Stack Developer">Full-Stack Developer</option>
                                <option value="Mobile Developer">Mobile Developer</option>
                                <option value="Game Developer">Game Developer</option>
                                <option value="Embedded Systems Developer">Embedded Systems Developer</option>
                                <option value="DevOps Engineer">DevOps Engineer</option>
                                <option value="Cloud Engineer">Cloud Engineer</option>
                                <option value="Data Engineer">Data Engineer</option>
                                <option value="QA Engineer">QA Engineer</option>
                                <option value="Automation Tester">Automation Tester</option>
                                <option value="Security Tester">Security Tester (Ethical Hacker)</option>
                                <option value="Database Administrator">Database Administrator (DBA)</option>
                                <option value="Data Scientist">Data Scientist</option>
                                <option value="Data Analyst">Data Analyst</option>
                                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                                <option value="UI Designer">UI Designer</option>
                                <option value="UX Designer">UX Designer</option>
                                <option value="Product Designer">Product Designer</option>
                                <option value="Graphic Designer">Graphic Designer</option>
                                <option value="Product Manager">Product Manager</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="Business Analyst">Business Analyst</option>
                                <option value="Cybersecurity Engineer">Cybersecurity Engineer</option>
                                <option value="Network Engineer">Network Engineer</option>
                                <option value="Security Analyst">Security Analyst</option>
                                <option value="System Administrator">System Administrator</option>
                                <option value="Blockchain Developer">Blockchain Developer</option>
                                <option value="AI Engineer">AI Engineer</option>
                                <option value="AR/VR Developer">AR/VR Developer</option>
                            </select>
                        </div>

                        <div className="addpost-field">
                            <label htmlFor="experience" className="addpost-label">
                                Experience
                            </label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                name="exp"
                                value={formdata.exp}
                                id="experience"
                                placeholder="Enter Experience"
                                className="addpost-input"
                            />
                        </div>

                        {/* Row 2: Company Name and Company Location */}
                        <div className="addpost-field">
                            <label htmlFor="companyName" className="addpost-label">Company Name</label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                name="companyname"
                                value={formdata.companyname}
                                id="companyName"
                                placeholder="Enter Company Name"
                                className="addpost-input"
                            />
                        </div>
                        <div className="addpost-field">
                            <label htmlFor="companylocation" className="addpost-label">Company Location</label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                name="companylocation"
                                value={formdata.companylocation}
                                id="companylocation"
                                placeholder="Enter Company Location"
                                className="addpost-input"
                            />
                        </div>

                        {/* Row 3: Work Location and Salary */}
                        <div className="addpost-field">
                            <label htmlFor="worklocation" className="addpost-label">Work Location</label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                name="worklocation"
                                value={formdata.worklocation}
                                id="worklocation"
                                placeholder="Enter Work Location"
                                className="addpost-input"
                            />
                        </div>
                        <div className="addpost-field">
                            <label htmlFor="salary" className="addpost-label">Salary Range</label>
                            <input
                                onChange={handleInputChange}
                                type="text"
                                id="salary"
                                name="sal"
                                value={formdata.sal}
                                placeholder="Enter Salary Range"
                                className="addpost-input"
                            />
                        </div>

                        {/* Row 4: Skills and Two-Line Paragraph */}
                        <div className="addpost-field">
                            <label htmlFor="skills" className="addpost-label">Skills</label>
                            <input
                                onChange={handleChange}
                                type="text"
                                name="skills"
                                value={formdata.skills.join(", ").toLocaleUpperCase()}
                                id="skills"
                                placeholder="Enter Skills"
                                className="addpost-input"
                            />
                        </div>

                        {/* Full-Width Fields */}
                        <div className="addpost-field full-width">
                            <label htmlFor="companyoverview" className="addpost-label">Company Overview</label>
                            <textarea
                                onChange={handleInputChange}
                                name="companyoverview"
                                value={formdata.companyoverview}
                                id="companyoverview"
                                placeholder="Enter company Overview"
                                className="addpost-textarea"
                            />
                        </div>

                        <div className="addpost-field full-width">
                            <label htmlFor="jobOverview" className="addpost-label">Job Overview</label>
                            <textarea
                                onChange={handleInputChange}
                                name="joboverview"
                                value={formdata.joboverview}
                                id="jobOverview"
                                placeholder="Enter Job Overview"
                                className="addpost-textarea"
                            />
                        </div>
                        <div className="addpost-field full-width">
                            <label htmlFor="responsibilities" className="addpost-label">Key Responsibilities</label>
                            <textarea
                                onChange={handleTextareaChange}
                                name="keyresponsibilities"
                                value={formdata.keyresponsibilities.join(".")}
                                id="responsibilities"
                                placeholder="Enter Key Responsibilities"
                                className="addpost-textarea"
                            />
                        </div>
                        <div className="addpost-field full-width">
                            <label htmlFor="requiredskills" className="addpost-label">Required Skills & Qualifications</label>
                            <textarea
                                onChange={handleTextareaChange}
                                name="requiredskills"
                                value={formdata.requiredskills.join(".")}
                                id="requiredskills"
                                placeholder="Enter Skills and Qualifications"
                                className="addpost-textarea"
                            />
                        </div>


                        <button type="submit" className="addpost-button">
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Edit;



{/* Existing form fields */}
                        {/* ... */}

                        <div className="addpost-field full-width">
                            <label htmlFor="companyoverview" className="addpost-label">Company Overview</label>
                            <textarea
                                onChange={handleInputChange}
                                name="companyoverview"
                                value={formdata.companyoverview}
                                id="companyoverview"
                                placeholder="Enter company Overview"
                                className="addpost-textarea"
                            />
                        </div>