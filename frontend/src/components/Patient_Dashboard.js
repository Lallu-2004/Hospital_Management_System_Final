
// import React from 'react';
// import { Routes, Route, useNavigate, Link } from 'react-router-dom';
// import '../styles/PatientDashboard.css';
// import Patient_BookAppointment from './Patient_BookAppointment';
// import Patient_AppointmentHistory from './Patient_AppointmentHistory';
// import Patient_AppointmentStatus from './Patient_AppointmentStatus';
// import PatientProfile from './Patient_Profile';
// import Navbar from './Navbar';

// const Patient_Dashboard = () => {
//     const navigate = useNavigate();

//     const goToLogout = () => {
//         alert("Logged out successfully!");
//         // optionally: navigate("/login");
//     };

//     return (
//         <div className="patient-dashboard">
//             {/* Navbar */}
//            <Navbar />

//             {/* Main Layout */}
//             <div className="dashboard-container">
//                 <div className="sidebar">
//                     <div className="menu-item-title"></div>
//                     <Link to="/patient" className={`menu-item`}>Home</Link>
//                     <Link to="/patient/book" className={`menu-item`}>Book Appointment</Link>
//                     <Link to="/patient/history" className={`menu-item`}>Appointment History</Link>
//                     <Link to="/patient/status" className={`menu-item`}>Appointment Status</Link>
//                     <Link to="/patient/profile" className={`menu-item`}>Profile</Link>

//                 </div>

//                 <div className="main-content">
//                     <Routes>
//                         <Route
//                             path="/"
//                             element={
//                                 <div className="dashboard-main">
//                                     <h2 className="welcome-text-large">Welcome Kenny Sebastian</h2>
//                                     <div className="grid-cards">
//                                         <div className="card" onClick={() => navigate('/patient/book')}>
//                                             <div className="card-title">Book My Appointment</div>
//                                             <div className="card-subtext">Book Appointment</div>
//                                         </div>
//                                         <div className="card" onClick={() => navigate('/patient/history')}>
//                                             <div className="card-title">My Appointments</div>
//                                             <div className="card-subtext">View Appointment History</div>
//                                         </div>
//                                         <div className="card" onClick={() => navigate('/patient/status')}>
//                                             <div className="card-title">Appointment Status</div>
//                                             <div className="card-subtext">Check Status</div>
//                                         </div>
//                                         <div className="card" onClick={() => navigate('/patient/profile')}>
//                                             <div className="card-title">My Profile</div>
//                                             <div className="card-subtext">View Profile</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             }
//                         />
//                         <Route path="book" element={<Patient_BookAppointment />} />
//                         <Route path="history" element={<Patient_AppointmentHistory />} />
//                         <Route path="status" element={<Patient_AppointmentStatus />} />
//                         <Route path="profile" element={<PatientProfile />} />

//                     </Routes>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Patient_Dashboard;

import React from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import '../styles/PatientDashboard.css';
import Patient_BookAppointment from './Patient_BookAppointment';
import Patient_AppointmentHistory from './Patient_AppointmentHistory';
import Patient_AppointmentStatus from './Patient_AppointmentStatus';
import PatientProfile from './Patient_Profile';
import Navbar from './Navbar';

const Patient_Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="patient-dashboard">
            <Navbar />
            
            <div className="dashboard-container">
                <div className="sidebar">
                    <Link to="/patient" className="menu-item">Home</Link>
                    <Link to="/patient/book" className="menu-item">Book Appointment</Link>
                    <Link to="/patient/history" className="menu-item">Appointment History</Link>
                    <Link to="/patient/status" className="menu-item">Appointment Status</Link>
                    <Link to="/patient/profile" className="menu-item">Profile</Link>
                </div>

                <div className="main-content">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="dashboard-main">
                                    <h2 className="welcome-text-large">Welcome!</h2>
                                    <div className="grid-cards">
                                        <div className="card" onClick={() => navigate('/patient/book')}>
                                            <h3 className="card-title">Book My Appointment</h3>
                                            <p className="card-subtext">Schedule a new doctor visit</p>
                                        </div>
                                        <div className="card" onClick={() => navigate('/patient/history')}>
                                            <h3 className="card-title">My Appointments</h3>
                                            <p className="card-subtext">View past and upcoming visits</p>
                                        </div>
                                        <div className="card" onClick={() => navigate('/patient/status')}>
                                            <h3 className="card-title">Appointment Status</h3>
                                            <p className="card-subtext">Check your current bookings</p>
                                        </div>
                                        <div className="card" onClick={() => navigate('/patient/profile')}>
                                            <h3 className="card-title">My Profile</h3>
                                            <p className="card-subtext">View and update your details</p>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                        <Route path="book" element={<Patient_BookAppointment />} />
                        <Route path="history" element={<Patient_AppointmentHistory />} />
                        <Route path="status" element={<Patient_AppointmentStatus />} />
                        <Route path="profile" element={<PatientProfile />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Patient_Dashboard;
