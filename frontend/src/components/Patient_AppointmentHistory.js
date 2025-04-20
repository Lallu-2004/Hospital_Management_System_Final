
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import '../styles/AppointmentHistory.css';

// // const Patient_AppointmentHistory = () => {
// //     const [appointments, setAppointments] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         const fetchAppointments = async () => {
// //             try {
// //                 const res = await axios.get('/api/prescriptions-dashboard', { withCredentials: true });
// //                 setAppointments(res.data);
// //             } catch (error) {
// //                 console.error("Error fetching prescriptions:", error);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchAppointments();
// //     }, []);

// //     return (
// //         <div className="history-container">
// //             <h2>Appointment History</h2>
// //             {loading ? (
// //                 <p>Loading...</p>
// //             ) : appointments.length === 0 ? (
// //                 <p>No past appointments found.</p>
// //             ) : (
// //                 <ul className="history-list">
// //                     {appointments.map((treatment, index) => (
// //                         <li key={index} className="history-card">
// //                             <div className="history-details">
// //                                 <strong>Consultation ID:</strong> {treatment.c_id} <br />
// //                                 <strong>Doctor:</strong> {treatment.doctor_name} <br />
// //                                 <strong>Diagnosis:</strong> {treatment.diagnosis} <br />
// //                                 <strong>Recommended Tests:</strong> {treatment.recommended_tests || 'None'} <br />
// //                                 <strong>Additional Notes:</strong> {treatment.additional_notes || 'None'} <br />
// //                                 <strong>Admit Required:</strong> {treatment.admit === 1 ? 'Yes' : 'No'} <br />
// //                                 <strong>Tests Conducted:</strong> {treatment.tests_conducted || 'N/A'} <br />
// //                                 <strong>Test Results:</strong> {treatment.test_results || 'N/A'} <br />
// //                                 <strong>Further Treatment:</strong> {treatment.further_treatment || 'N/A'}
// //                             </div>
// //                         </li>
// //                     ))}
// //                 </ul>
// //             )}
// //         </div>
// //     );
// // };

// // export default Patient_AppointmentHistory;


// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import '../styles/AppointmentHistory.css';

// // const Patient_AppointmentHistory = () => {
// //     const [appointments, setAppointments] = useState([]);
// //     const [tests, setTests] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         const fetchData = async () => {
// //             try {
// //                 // Fetch appointments
// //                 const appointmentRes = await axios.get('/api/prescriptions-dashboard', { withCredentials: true });
// //                 const fetchedAppointments = appointmentRes.data;

// //                 // Fetch tests
// //                 let testRes = [];
// //                 try {
// //                     const testResponse = await axios.get('/api/tests', { withCredentials: true });
// //                  //   console.log("aaaaaaa - Test Data Response:", testResponse.data);
// //                     testRes = testResponse.data;
// //                 } catch (testErr) {
// //                     console.warn("Couldn't fetch tests, setting empty list.");
// //                     testRes = []; // Default to empty if error
// //                 }

// //                 // Attach test info to corresponding prescriptions
// //                 const updatedAppointments = fetchedAppointments.map(appointment => {
// //                     const relatedTests = testRes.filter(t => t.prescription_id === appointment.prescription_id);

// //                     // Combine data from all related test entries
// //                     const testsConducted = relatedTests.map(t => t.test_name).join(', ') || 'N/A';
// //                     const testResults = relatedTests.map(t => t.result).join(', ') || 'N/A';
// //                     const furtherTreatment = relatedTests.map(t => t.further_treatment).join(', ') || 'N/A';

// //                     return {
// //                         ...appointment,
// //                         tests_conducted: testsConducted,
// //                         test_results: testResults,
// //                         further_treatment: furtherTreatment
// //                     };
// //                 });

// //                 setAppointments(updatedAppointments);
// //             } catch (error) {
// //                 console.error("Error fetching data:", error);
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         fetchData();
// //     }, []);

// //     return (
// //         <div className="history-container">
// //             <h2>Appointment History</h2>
// //             {loading ? (
// //                 <p>Loading...</p>
// //             ) : appointments.length === 0 ? (
// //                 <p>No past appointments found.</p>
// //             ) : (
// //                 <ul className="history-list">
// //                     {appointments.map((treatment, index) => (
// //                         <li key={index} className="history-card">
// //                             <div className="history-details">
// //                                 <strong>Consultation ID:</strong> {treatment.c_id} <br />
// //                                 <strong>Doctor:</strong> {treatment.doctor_name} <br />
// //                                 <strong>Diagnosis:</strong> {treatment.diagnosis} <br />
// //                                 <strong>Recommended Tests:</strong> {treatment.recommended_tests || 'None'} <br />
// //                                 <strong>Additional Notes:</strong> {treatment.additional_notes || 'None'} <br />
// //                                 <strong>Admit Required:</strong> {treatment.admit === 1 ? 'Yes' : 'No'} <br />
// //                                 <strong>Tests Conducted:</strong> {treatment.tests_conducted || 'N/A'} <br />
// //                                 <strong>Test Results:</strong> {treatment.test_results || 'N/A'} <br />
// //                                 <strong>Further Treatment:</strong> {treatment.further_treatment || 'N/A'}
// //                             </div>
// //                         </li>
// //                     ))}
// //                 </ul>
// //             )}
// //         </div>
// //     );
// // };

// // export default Patient_AppointmentHistory;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/AppointmentHistory.css';

// const Patient_AppointmentHistory = () => {
//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch appointments
//                 const appointmentRes = await axios.get('/api/prescriptions-dashboard', { withCredentials: true });
//                 const fetchedAppointments = appointmentRes.data;
//                 console.log("cccccccc",fetchedAppointments);

//                 // Fetch tests
//                 let testRes = [];
//                 try {
//                     const testResponse = await axios.get('/api/tests', { withCredentials: true });
//                     // Optional: log to debug
//                     console.log("aaaaaaa - Test Data Response:", testResponse.data);
//                     testRes = testResponse.data;

//                 } catch (testErr) {
//                     console.warn("Couldn't fetch tests, setting empty list.");
//                     testRes = []; // Default to empty if error
//                 }

//                 // Attach test info to corresponding prescriptions
//                 const updatedAppointments = fetchedAppointments.map(appointment => {
                    
//                    // const relatedTests = testRes.filter(t => t.prescription_id === appointment.p_id);
//                    const relatedTests = testRes.filter(
//                     t => String(t.prescription_id) === String(appointment.p_id)
//                 );
//                     console.log(appointment.p_id);
//                     console.log("All testRes items:", testRes);
//                     console.log("bbbbbbb - Test Data Response:", relatedTests);

//                     const testsConducted = relatedTests.map(t => t.test_name).join(', ') || 'N/A';
//                     const testResults = relatedTests.map(t => t.result).join(', ') || 'N/A';
//                     const furtherTreatment = relatedTests.map(t => t.further_treatment).join(', ') || 'N/A';

//                     return {
//                         ...appointment,
//                         tests_conducted: testsConducted,
//                         test_results: testResults,
//                         further_treatment: furtherTreatment
//                     };
//                 });

//                 setAppointments(updatedAppointments);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     return (
//         <div className="history-container">
//             <h2>Appointment History</h2>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : appointments.length === 0 ? (
//                 <p>No past appointments found.</p>
//             ) : (
//                 <ul className="history-list">
//                     {appointments.map((treatment, index) => (
//                         <li key={index} className="history-card">
//                             <div className="history-details">
//                                 <strong>Consultation ID:</strong> {treatment.c_id} <br />
//                                 <strong>Doctor:</strong> {treatment.doctor_name} <br />
//                                 <strong>Diagnosis:</strong> {treatment.diagnosis} <br />
//                                 <strong>Recommended Tests:</strong> {treatment.recommended_tests || 'None'} <br />
//                                 <strong>Additional Notes:</strong> {treatment.additional_notes || 'None'} <br />
//                                 <strong>Admit Required:</strong> {treatment.admit === 1 ? 'Yes' : 'No'} <br />
//                                 <strong>Tests Conducted:</strong> {treatment.tests_conducted || 'N/A'} <br />
//                                 <strong>Test Results:</strong> {treatment.test_results || 'N/A'} <br />
//                                 <strong>Further Treatment:</strong> {treatment.further_treatment || 'N/A'}
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default Patient_AppointmentHistory;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AppointmentHistory.css';
import axiosInstance from '../utils/axiosInstance';

const Patient_AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch appointments
                const appointmentRes = await axiosInstance.get('/api/prescriptions-dashboard', { withCredentials: true });
                const fetchedAppointments = appointmentRes.data;

                // Fetch tests
                let testRes = [];
                try {
                    const testResponse = await axiosInstance.get('/api/tests', { withCredentials: true });
                    testRes = testResponse.data;
                } catch (testErr) {
                    console.warn("Couldn't fetch tests, setting empty list.");
                    testRes = [];
                }

                console.log("All testRes items:", testRes);

                // Attach test info to corresponding prescriptions
                const updatedAppointments = fetchedAppointments.map(appointment => {
                  

                    const relatedTests = testRes.filter(t => String(t.prescription_id) === String(appointment.p_id));

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
            <h2>Appointment History</h2>
            {loading ? (
                <p>Loading...</p>
            ) : appointments.length === 0 ? (
                <p>No past appointments found.</p>
            ) : (
                <ul className="history-list">
                    {appointments.map((treatment, index) => (
                        <li key={index} className="history-card">
                            <div className="history-details">
                                <strong>Consultation ID:</strong> {treatment.c_id} <br />
                                <strong>Doctor:</strong> {treatment.doctor_name} <br />
                                <strong>Diagnosis:</strong> {treatment.diagnosis} <br />
                                <strong>Recommended Tests:</strong> {treatment.recommended_tests || 'None'} <br />
                                <strong>Additional Notes:</strong> {treatment.additional_notes || 'None'} <br />
                                <strong>Admit Required:</strong> {treatment.admit === 1 ? 'Yes' : 'No'} <br />
                                <strong>Tests Conducted:</strong> {treatment.tests_conducted || 'N/A'} <br />
                                <strong>Test Results:</strong> {treatment.test_results || 'N/A'} <br />
                                <strong>Further Treatment:</strong> {treatment.further_treatment || 'N/A'}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Patient_AppointmentHistory;
