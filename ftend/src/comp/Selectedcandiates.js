import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './AdminAppliedDetails.css';

const SelectedCandidates = () => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = Cookies.get('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.token) {
                    setUser(parsedUser);
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error parsing user data from cookies:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (!user?._id) return;

        const fetchData = async () => {
            try {
                const [appliedRes, statusRes] = await Promise.all([
                    axios.get("http://localhost:5000/getbyapplied"),
                    axios.get(`http://localhost:5000/getstatus/${user._id}`)
                ]);

                setData(appliedRes.data);
                setStatusData(statusRes.data);

                const uniqueRoles = [...new Set(appliedRes.data.map((job) => job.role))];
                setJobRoles(uniqueRoles);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        let filtered = data.filter(job =>
            statusData.some(status => status.jobid === job.jobid)
        );

        if (selectedRole) {
            filtered = filtered.filter(job => job.role === selectedRole);
        }

        if (selectedStatus) {
            filtered = filtered.filter(job =>
                (statusData.find(status => status.jobid === job.jobid)?.status || 'N/A') === selectedStatus
            );
        }

        setFilteredJobs(filtered);
        setCurrentPage(1);
    }, [data, statusData, selectedRole, selectedStatus]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const paginatedJobs = filteredJobs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className='admin-container'>
            <div style={{ display: "flex", gap: "50px" }}>
                <div>
                    <label htmlFor='roleSelect' className='admin-label'>Select Role</label>
                    <select id='roleSelect' className='admin-select' onChange={(e) => setSelectedRole(e.target.value)} defaultValue=''>
                        <option disabled value=''>-- Select --</option>
                        {jobRoles.map((role, index) => (
                            <option key={index} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor='statusSelect' className='admin-label'>Select Status</label>
                    <select id='statusSelect' className='admin-select' onChange={(e) => setSelectedStatus(e.target.value)} defaultValue=''>
                        <option disabled value=''>-- Select --</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className='admin-table-container'>
                {paginatedJobs.length > 0 ? (
                    <>
                        <table className='admin-table'>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Job ID</th>
                                    <th>Role</th>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Phone No</th>
                                    <th>Resume</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedJobs.map((job, index) => {
                                    const candidateStatus = statusData.find(status => status.jobid === job.jobid)?.status || 'N/A';
                                    return (
                                        <tr key={job.userid + job.jobid}>
                                            <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                                            <td>{job.jobid}</td>
                                            <td>{job.role}</td>
                                            <td>{job.userid}</td>
                                            <td>{job.fullname}</td>
                                            <td>{job.phno}</td>
                                            <td>
                                                <a href={`http://localhost:5000/resume/${job.resume}`} target='_blank' rel='noopener noreferrer'>
                                                    View Resume
                                                </a>
                                            </td>
                                            <td style={{ color: candidateStatus === "Accepted" ? "green" : "red" }}>
                                                {candidateStatus}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <Stack spacing={2} className='pagination-container'>
                            <Pagination count={Math.ceil(filteredJobs.length / rowsPerPage)} color='primary' page={currentPage} onChange={handlePageChange} />
                        </Stack>
                    </>
                ) : (
                    <h2 className="no-data-message" style={{ color: "black", textAlign: "center" }}>No data available</h2>
                )}
            </div>
        </div>
    );
};

export default SelectedCandidates;