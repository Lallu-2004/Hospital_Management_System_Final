
import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import '../styles/DoctorDashboard.css';
import Doctor_Appointments from './Doctor_Appointments';
import Doctor_TreatedPatients from './Doctor_TreatedPatients';
import Doctor_Prescriptions from './Doctor_Prescriptions';
import Doctor_Profile from './Doctor_Profile';
import Doctor_Patient_Query from './Doctor_Patient_Query';
import Navbar from './Navbar';
import doctor1 from '../styles/doctor1.jpg';


const Doctor_Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="doctor-dashboard">
            <Navbar />
            
            <div className="dashboard-container">
                <div className="sidebar">
                    <Link to="/doctor" className="menu-item">Home</Link>
                    <Link to="/doctor/appointments" className="menu-item">Appointments</Link>
                    <Link to="/doctor/treated" className="menu-item">Treated Patients</Link>
                    <Link to="/doctor/prescriptions" className="menu-item">Prescriptions</Link>
                    <Link to="/doctor/profile" className="menu-item">Profile</Link>
                    <Link to="/doctor/patient-query" className="menu-item">Patient Query</Link>
                </div>

                <div className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="dashboard-main">
                                    <div className="doctor-profile-card">
                                        <img src={doctor1} alt="Dr. Martin Deo" className="doctor-image" />
                                        <div className="doctor-info">
                                            <h2 className="doctor-name">Dr. Martin Deo</h2>
                                            <p className="doctor-qual">MBBS, MD (Cardiology)</p>
                                        </div>
                                    </div>

                                    <div className="grid-cards">
                                        <div className="card" onClick={() => navigate('/doctor/appointments')}>
                                            <h3 className="card-title">Appointments</h3>
                                            <p className="card-subtext">View all scheduled patients</p>
                                        </div>
                                        <div className="card" onClick={() => navigate('/doctor/treated')}>
                                            <h3 className="card-title">Treated Patients</h3>
                                            <p className="card-subtext">List of recently treated patients</p>
                                        </div>
                                        <div className="card" onClick={() => navigate('/doctor/prescriptions')}>
                                            <h3 className="card-title">Prescriptions</h3>
                                            <p className="card-subtext">Manage and review prescriptions</p>
                                        </div>
                                        <div className="card" onClick={() => navigate('/doctor/profile')}>
                                            <h3 className="card-title">Profile</h3>
                                            <p className="card-subtext">View Profile</p>
                                        </div>
                                        <div className="card" onClick={() => navigate('/doctor/patient-query')}>
                                            <h3 className="card-title">Patient Query</h3>
                                            <p className="card-subtext">Query a Patient</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                        <Route path="appointments" element={<Doctor_Appointments />} />
                        <Route path="treated" element={<Doctor_TreatedPatients />} />
                        <Route path="prescriptions" element={<Doctor_Prescriptions />} />
                        <Route path="profile" element={<Doctor_Profile />} />
                        <Route path="patient-query" element={<Doctor_Patient_Query />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Doctor_Dashboard;