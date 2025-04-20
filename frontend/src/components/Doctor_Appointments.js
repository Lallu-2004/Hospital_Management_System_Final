

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/CommonTable.css'; // Adjust path if needed

// const Doctor_Appointments = () => {
//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchAppointments = async () => {
//             try {
//                 const response = await axios.get('/api/book-appointment', {
//                     withCredentials: true,
//                 });
//                 setAppointments(response.data);
//             } catch (err) {
//                 console.error('Error fetching appointments:', err);
//                 setError('Failed to load appointments.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAppointments();
//     }, []);

//     // Function to format the date
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-GB', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric',
//         });
//     };

//     return (
//         <div className="table-container">
//             <h2>Appointments</h2>
//             {loading ? (
//                 <p>Loading...</p>
//             ) : error ? (
//                 <p style={{ color: 'red' }}>{error}</p>
//             ) : (
//                 <table className="styled-table">
//                     <thead>
//                         <tr>
//                             <th>Patient ID</th>
//                             <th>Patient Name</th>
//                             <th>Date</th>
//                             <th>Time</th>
//                             <th>Consultation Room</th>
//                             <th>Reason</th>
//                             <th>Previous Medication</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {appointments.map((apt) => (
//                             <tr key={apt.c_id}>
//                                 <td>{apt.patient_id}</td>
//                                 <td>{apt.patient_name}</td>
//                                 <td>{formatDate(apt.date)}</td>
//                                 <td>{apt.time}</td>
//                                 <td>{apt.consultation_room_number}</td>
//                                 <td>{apt.reason}</td>
//                                 <td>{apt.previous_medication}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default Doctor_Appointments;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommonTable.css'; // Adjust path if needed
import axiosInstance from '../utils/axiosInstance';

const Doctor_Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get('/api/book-appointment', {
                    withCredentials: true,
                });
                setAppointments(response.data);
            } catch (err) {
                console.error('Error fetching appointments:', err);
                setError('Failed to load appointments.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="table-container">
            <h2>Appointments</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Consultation ID</th>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Consultation Room</th>
                            <th>Reason</th>
                            <th>Previous Medication</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((apt) => (
                            <tr key={apt.c_id}>
                                <td>{apt.c_id}</td>
                                <td>{apt.patient_id}</td>
                                <td>{apt.patient_name}</td>
                                <td>{formatDate(apt.date)}</td>
                                <td>{apt.time}</td>
                                <td>{apt.consultation_room_number}</td>
                                <td>{apt.reason}</td>
                                <td>{apt.previous_medication}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Doctor_Appointments;

