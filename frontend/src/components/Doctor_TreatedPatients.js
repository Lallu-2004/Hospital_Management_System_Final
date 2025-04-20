
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../styles/CommonTable.css';

// const Doctor_TreatedPatients = () => {
//     const [treated, setTreated] = useState([]);

//     useEffect(() => {
//         const fetchPrescriptions = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api/prescriptions-dashboard', {
//                     withCredentials: true,  // Add this if you're using cookies for session management
//                 });

//                 // Set the fetched data into state
//                 setTreated(response.data);
//             } catch (error) {
//                 console.error('Error fetching prescriptions:', error);
//             }
//         };

//         fetchPrescriptions();
//     }, []); // Empty dependency array ensures it runs once on component mount

//     return (
//         <div className="table-container">
//             <h2>Treated Patients</h2>
//             <table className="styled-table">
//                 <thead>
//                     <tr>
//                         <th>Consultation ID</th>
//                         <th>Patient Name</th>
//                         <th>Diagnosis</th>
//                         <th>Recommended Tests</th>
//                         <th>Additional Info</th>
//                         <th>Admit</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {treated.length > 0 ? (
//                         treated.map((p) => (
//                             <tr key={p.c_id}>
//                                 <td>{p.c_id}</td>
//                                 <td>{p.patient_name}</td>
//                                 <td>{p.diagnosis}</td>
//                                 <td>{p.recommended_tests}</td>
//                                 <td>{p.additional_notes}</td>
//                                 <td>{p.admit ? 'Yes' : 'No'}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="6">No prescriptions found.</td>
//                         </tr>
//                     )}
//                 </tbody>
//             </table>
//         </div>
//     );
// };
//export default Doctor_TreatedPatients;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AppointmentHistory.css';
import axiosInstance from '../utils/axiosInstance';

const Doctor_AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch appointments for doctor
                const appointmentRes = await axiosInstance.get('/api/prescriptions-dashboard', { withCredentials: true });
                const fetchedAppointments = appointmentRes.data;
                console.log("Fetched Doctor Appointments:", fetchedAppointments);

                // Fetch related tests
                let testRes = [];
                try {
                    const testResponse = await axiosInstance.get('/s', { withCredentials: true });
                    console.log("Test Data Response:", testResponse.data);
                    testRes = testResponse.data;
                } catch (testErr) {
                    console.warn("Couldn't fetch tests, setting empty list.");
                    testRes = [];
                }

                console.log("All Test Data:", testRes);

                // Attach test info to corresponding appointments
                const updatedAppointments = fetchedAppointments.map(appointment => {
                    console.log("Checking appointment ID:", appointment.p_id);

                    const relatedTests = testRes.filter(t => String(t.prescription_id) === String(appointment.p_id));
                    console.log("Related Tests for p_id", appointment.p_id, ":", relatedTests);

                    const testsConducted = relatedTests.map(t => t.tests_conducted).join(', ') || 'N/A';
                    const testResults = relatedTests.map(t => t.test_results).join(', ') || 'N/A';
                    const furtherTreatment = relatedTests.map(t => t.further_treatment).join(', ') || 'N/A';

                    return {
                        ...appointment,
                        tests_conducted: testsConducted,
                        test_results: testResults,
                        further_treatment: furtherTreatment
                    };
                });

                setAppointments(updatedAppointments);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="history-container">
            <h2>Doctor's Appointment History</h2>
            {loading ? (
                <p>Loading...</p>
            ) : appointments.length === 0 ? (
                <p>No past appointments found.</p>
            ) : (
                <ul className="history-list">
                    {appointments.map((appointment, index) => (
                        <li key={index} className="history-card">
                            <div className="history-details">
                                <strong>Consultation ID:</strong> {appointment.c_id} <br />
                                <strong>Patient:</strong> {appointment.patient_name} <br />
                                <strong>Diagnosis:</strong> {appointment.diagnosis} <br />
                                <strong>Recommended Tests:</strong> {appointment.recommended_tests || 'None'} <br />
                                <strong>Additional Notes:</strong> {appointment.additional_notes || 'None'} <br />
                                <strong>Admit Required:</strong> {appointment.admit === 1 ? 'Yes' : 'No'} <br />
                                <strong>Tests Conducted:</strong> {appointment.tests_conducted || 'N/A'} <br />
                                <strong>Test Results:</strong> {appointment.test_results || 'N/A'} <br />
                                <strong>Further Treatment:</strong> {appointment.further_treatment || 'N/A'}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Doctor_AppointmentHistory;
