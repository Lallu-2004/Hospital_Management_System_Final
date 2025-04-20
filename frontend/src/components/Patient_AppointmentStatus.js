
// // import React from 'react';
// // import '../styles/AppointmentStatus.css';

// // const Patient_AppointmentStatus = () => {
// //     const appointment = {
// //         doctor_id: 'D123',
// //         doctor_name: 'Dr. John Doe',
// //         date: '2025-04-18',
// //         time: '10:30 AM',
// //         consultation_room_number: 'Room 202'
// //     };

// //     return (
// //         <div className="status-container">
// //             <h2>Appointment Status</h2>
// //             <div className="status-card">
// //                 <p><strong>Doctor ID:</strong> {appointment.doctor_id}</p>
// //                 <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
// //                 <p><strong>Date:</strong> {appointment.date}</p>
// //                 <p><strong>Time:</strong> {appointment.time}</p>
// //                 <p><strong>Room No:</strong> {appointment.consultation_room_number}</p>
// //                 <p className="status-confirmed">✅ Appointment Confirmed</p>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Patient_AppointmentStatus;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/AppointmentStatus.css';

// const Patient_AppointmentStatus = () => {
//     const [appointments, setAppointments] = useState([]);

//     useEffect(() => {
//         const fetchAppointments = async () => {
//             try {
//                 const res = await axios.get('/api/book-appointment', {
//                     withCredentials: true
//                 });
//                 setAppointments(res.data); // All appointments of the patient
//             } catch (err) {
//                 console.error('Error fetching appointments:', err);
//             }
//         };

//         fetchAppointments();
//     }, []);

//     return (
//         <div className="status-container">
//             <h2>Appointment Status</h2>
//             {appointments.length > 0 ? (
//                 appointments.map((appointment, index) => (
//                     <div className="status-card" key={index}>
//                         <p><strong>Doctor ID:</strong> {appointment.doctor_id}</p>
//                         <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
//                         <p><strong>Date:</strong> {appointment.date}</p>
//                         <p><strong>Time:</strong> {appointment.time}</p>
//                         <p><strong>Room No:</strong> {appointment.consultation_room_number}</p>
//                         <p className="status-confirmed">✅ Appointment Confirmed</p>
//                     </div>
//                 ))
//             ) : (
//                 <p>No appointments found.</p>
//             )}
//         </div>
//     );
// };

// export default Patient_AppointmentStatus;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AppointmentStatus.css';
import axiosInstance from '../utils/axiosInstance';

const Patient_AppointmentStatus = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axiosInstance.get('/api/book-appointment', {
                    withCredentials: true
                });
                setAppointments(res.data); // All appointments of the patient
            } catch (err) {
                console.error('Error fetching appointments:', err);
            }
        };

        fetchAppointments();
    }, []);

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="status-container">
            <h2>Appointment Status</h2>
            {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                    <div className="status-card" key={index}>
                        <p><strong>Doctor ID:</strong> {appointment.doctor_id}</p>
                        <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
                        <p><strong>Date:</strong> {formatDate(appointment.date)}</p> {/* Format the date */}
                        <p><strong>Time:</strong> {appointment.time}</p>
                        <p><strong>Room No:</strong> {appointment.consultation_room_number}</p>
                        <p className="status-confirmed">✅ Appointment Confirmed</p>
                    </div>
                ))
            ) : (
                <p>No appointments found.</p>
            )}
        </div>
    );
};

export default Patient_AppointmentStatus;
