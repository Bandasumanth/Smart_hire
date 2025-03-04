import React, { useEffect, useState } from "react";
import "../comp/Addpost.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
    let navigate = useNavigate();
    const [user, setUser] = useState({});
    const [showPreview, setShowPreview] = useState(false);

    const [formdata, setData] = useState({
        role: "",
        type: "",
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

    useEffect(() => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.token && parsedUser.role === "admin") {
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
        setData({ ...formdata, [e.target.name]: e.target.value });
        setShowPreview(true);
    };

    const handleTextareaChange = (e) => {
        setData({ ...formdata, [e.target.name]: e.target.value ? e.target.value.split(".") : [] });
        setShowPreview(true);
    };

    const handleChange = (e) => {
        setData({ ...formdata, [e.target.name]: e.target.value ? e.target.value.split(", ") : [] });
        setShowPreview(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            formdata.role !== "" &&
            formdata.type !== "" &&
            formdata.exp !== "" &&
            formdata.companyname !== "" &&
            formdata.sal !== "" &&
            formdata.companyoverview !== "" &&
            formdata.joboverview !== "" &&
            formdata.keyresponsibilities.length > 0 &&
            formdata.requiredskills.length > 0 &&
            formdata.skills.length > 0 &&
            formdata.worklocation !== "" &&
            formdata.companylocation !== ""
        ) {
            try {
                const res = await axios.post("http://localhost:5000/addjob", formdata);
                alert(res.data.msg);
                setData({
                    role: "",
                    type: "",
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
                navigate("/adhome");
            } catch (err) {
                console.error("Error submitting form:", err);
                alert("Failed to post job. Try again.");
            }
        } else {
            alert("Enter All Required Fields!...");
        }
    };

    return (
        <div className="main">
            <div className="addpost-container">
                <div className="addpost-card">
                    <h2 className="addpost-title">Post the Job Details</h2>
                    <form className="addpost-form" onSubmit={handleSubmit}>
                        <div className="addpost-field">
                            <label htmlFor="roleSelect" className="addpost-label">Role</label>
                            <select
                                onChange={handleInputChange}
                                id="roleSelect"
                                name="role"
                                value={formdata.role}
                                className="addpost-select"
                            >
                                <option disabled value="">-- Select --</option>
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
                        <label htmlFor="roleSelect" className="addpost-label">Type</label>
                        <select
                            onChange={handleInputChange}
                            id="roleSelect"
                            name="type"
                            value={formdata.type}
                            className="addpost-select"
                        >
                            <option value="">Select job Type</option>
                            <option value="Internship">Internship</option>
                            <option value="Full-Time">Full-time</option>
                            <option value="Both internships and full-time">Both internships and full-time</option>
                        </select>

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
                                style={{ width: "95%" }}
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
                                id="roleSelect"
                                placeholder="Enter Company Name"
                                className="addpost-input"
                                style={{ width: "95%" }}

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
                                style={{ width: "95%" }}
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
                                style={{ width: "95%" }}
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
                                style={{ width: "95%" }}
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
                                style={{ width: "95%" }}
                            />
                        </div>

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
                        <button type="submit" className="addpost-button">Post Job</button>
                    </form>
                </div>
                {showPreview && (
                    <div className="preview-container">
                        <h2 className="preview-title">Preview</h2>
                        <div className="preview-content">
                            {formdata.role && <p><strong>Role:</strong> {formdata.role}</p>}
                            {formdata.type && <p><strong>Job Type:</strong> {formdata.type}</p>}
                            {formdata.exp && <p><strong>Experience:</strong> {formdata.exp}</p>}
                            {formdata.companyname && <p><strong>Company Name:</strong> {formdata.companyname}</p>}
                            {formdata.companylocation && <p><strong>Company Location:</strong> {formdata.companylocation}</p>}
                            {formdata.worklocation && <p><strong>Work Location:</strong> {formdata.worklocation}</p>}
                            {formdata.sal && <p><strong>Salary Range:</strong> {formdata.sal}</p>}
                            {formdata.skills.length > 0 && <p><strong>Skills:</strong> {formdata.skills.join(", ")}</p>}
                            {formdata.companyoverview && (
                                <p style={{ textAlign: "justify" }}>
                                    <strong>Company Overview:</strong>
                                    <br />
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: formdata.companyoverview.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </p>
                            )}
                            {formdata.joboverview && (
                                <p style={{ textAlign: "justify" }}>
                                    <strong>Job Overview:</strong>
                                    <br />
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: formdata.joboverview.replace(/\n/g, "<br />"),
                                        }}
                                    />
                                </p>
                            )}

                            {formdata.keyresponsibilities.length > 0 && <p><strong style={{ marginBottom: "8px" }}>Key Responsibilities:</strong><br /><ul style={{ listStyleType: "none", lineHeight: "15px", marginTop: "10px" }}>{formdata.keyresponsibilities.map((obj, i) => <li key={i}>{obj}</li>)}</ul></p>}
                            {formdata.requiredskills.length > 0 && <p><strong>Required Skills & Qualifications:</strong><br /><ul style={{ listStyleType: "none", lineHeight: "15px", marginTop: "10px" }}>{formdata.requiredskills.map((obj, i) => <li key={i}>{obj}</li>)}</ul></p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddPost;