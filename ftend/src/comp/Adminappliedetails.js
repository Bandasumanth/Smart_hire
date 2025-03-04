import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './AdminAppliedDetails.css';
import { useNavigate } from 'react-router-dom';

const AdminAppliedDetails = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const rowsPerPage = 10;

    useEffect(() => {
        const storedUser = Cookies.get('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser?.token) {
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

        axios.get(`http://localhost:5000/getuserjob/${user._id}`)
            .then((res) => setData(res.data))
            .catch((err) => setError(err.message));

        axios.get(`http://localhost:5000/getstatus/${user._id}`)
            .then((res) => setStatusData(res.data))
            .catch((err) => console.log(err));
    }, [user]);

    const handleJobSelection = (e) => {
        const selectedJobId = e.target.value;
        setJobs([]); // Reset jobs before loading new ones

        if (selectedJobId) {
            axios.get(`http://localhost:5000/getbyjobid/${selectedJobId}`)
                .then((res) => setJobs(res.data))
                .catch((err) => console.log(err.message));
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleAcceptReject = async (userid, action, jobid, adminid, companyname, role, name) => {
        try {
            const response = await axios.post("http://localhost:5000/statusupdate", {
                jobid, adminid, userid, status: action, role
            });

            if (response.data.msg === "StatusUpdated..") {
                const subject = action === 'Accepted' ? 'Application Accepted' : 'Application Rejected';
                const text = action === 'Accepted'
                    ? `Dear ${name},\n\nThank you for your application for the ${role} role at ${companyname}. We were impressed with your background and skills, and we are excited to inform you that you have been shortlisted for the next stage of the selection process.\n\nBest regards,\nJobHunters`
                    : `Dear ${name},\n\nThank you for your interest in the ${role} role at ${companyname}. Unfortunately, our team has decided to move forward with other candidates for this position.\n\nBest regards,\nJobHunters`;

                await axios.post("http://localhost:5000/api/mail/send", { to: userid, subject, text });
                alert("Email sent");
            } else {
                alert(response.data.msg);
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status.');
        }
    };

    const filteredJobs = jobs.filter((job) => !statusData.some((obj) => obj.jobid === job.jobid));
    const paginatedJobs = filteredJobs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className='admin-container'>
            <label htmlFor='roleSelect' className='admin-label'>Select Role</label>
            <select id='roleSelect' className='admin-select' onChange={handleJobSelection} aria-label='Select Role' defaultValue=''>
                <option disabled value=''>-- Select --</option>
                {data.map((obj) => (
                    <option key={obj._id} value={obj._id}>{obj.role}</option>
                ))}
            </select>
    
            {paginatedJobs.length > 0 ? (
                <div className='admin-table-container'>
                    <table className='admin-table'>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Job ID</th>
                                <th>Role</th>
                                <th>UserID</th>
                                <th>Name</th>
                                <th>Phone No</th>
                                <th>Resume</th>
                                <th>Accept</th>
                                <th>Reject</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedJobs.map((e, i) => (
                                <tr key={`${e.userid}-${e.jobid}`}>
                                    <td>{(currentPage - 1) * rowsPerPage + i + 1}</td>
                                    <td>{e.jobid}</td>
                                    <td>{e.role}</td>
                                    <td>{e.userid}</td>
                                    <td>{e.fullname}</td>
                                    <td>{e.phno}</td>
                                    <td>
                                        <a href={`http://localhost:5000/resume/${e.resume}`} target='_blank' rel='noopener noreferrer'>
                                            View Resume
                                        </a>
                                    </td>
                                    <td>
                                        <button className='accept-btn' id='accept' onClick={() => handleAcceptReject(e.userid, 'Accepted', e.jobid, e.adminid, e.companyname, e.role, e.fullname)}>
                                            Accept
                                        </button>
                                    </td>
                                    <td>
                                        <button className='reject-btn' id='reject' onClick={() => handleAcceptReject(e.userid, 'Rejected', e.jobid, e.adminid, e.companyname, e.role, e.fullname)}>
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Stack spacing={2} className='pagination-container'>
                        <Pagination count={Math.ceil(filteredJobs.length / rowsPerPage)} color='primary' page={currentPage} onChange={handlePageChange} aria-label='Pagination' />
                    </Stack>
                </div>
            ) : (
                <h1 style={{ color: 'green', textAlign: 'center' }}>No Results Found for this Role</h1>
            )}
        </div>
    );
};

export default AdminAppliedDetails;
