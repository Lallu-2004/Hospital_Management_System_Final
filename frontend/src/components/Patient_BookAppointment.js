import React, { useState } from 'react';
import axios from 'axios';
import '../styles/BookAppointment.css';
import axiosInstance from '../utils/axiosInstance';

function Patient_BookAppointment() {
    const [form, setForm] = useState({
        name: '',
        age: '',
        specialization: '',
        problems: '',
        previousMedications: '',
        date: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(
                'http://localhost:5000/api/request-appointment',
                {
                    age: form.age,
                    name:form.name,
                    specialization: form.specialization,
                    problem: form.problems,
                    medications: form.previousMedications,
                    
                },
                {
                    withCredentials: true
                }
            );

            console.log(response.data.message);
            alert("Appointment Booked!");

            // Clear form after successful submission
            setForm({
                name: '',
                age: '',
                specialization: '',
                problems: '',
                previousMedications: '',
                date: ''
            });

        } catch (error) {
            console.error("Error booking appointment:", error.response?.data || error.message);
            alert("Failed to book appointment.");
        }
    };

    return (
        <div className="appointment-container">
            <h2>Book Appointment</h2>
            <form onSubmit={handleSubmit} className="appointment-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="age"
                    placeholder="Your Age"
                    required
                    value={form.age}
                    onChange={handleChange}
                />

                <select
                    name="specialization"
                    required
                    value={form.specialization}
                    onChange={handleChange}
                >
                    <option value="">Select Specialization</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Orthopedics</option>
                    <option>Dermatology</option>
                    <option>Not sure</option>
                </select>

                <input
                    type="text"
                    name="problems"
                    placeholder="Describe your problem"
                    required
                    value={form.problems}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="previousMedications"
                    placeholder="Previous Medications (if any)"
                    value={form.previousMedications}
                    onChange={handleChange}
                />

                {/* <input
                    type="date"
                    name="date"
                    required
                    value={form.date}
                    onChange={handleChange}
                /> */}

                <button type="submit">Confirm Appointment</button>
            </form>
        </div>
    );
}

export default Patient_BookAppointment;
