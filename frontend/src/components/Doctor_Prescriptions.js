import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CommonForm.css';
import axiosInstance from '../utils/axiosInstance';
const Doctor_Prescriptions = () => {
    const [formData, setFormData] = useState({
        cId: '',
        patientId: '',
        patientName: '',
        diagnosis: '',
        tests: '',
        notes: '',
        admitted: 'No',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(
                'http://localhost:5000/api/prescription',
                {
                    c_id: formData.cId,
                    patient_id: formData.patientId,
                    diagnosis: formData.diagnosis,
                    recommended_tests: formData.tests,
                    additional_notes: formData.notes,
                    admit: formData.admitted === 'Yes'
                },
                { withCredentials: true }  // Add withCredentials to send cookies
            );

            console.log('Prescription submitted:', response.data);
            alert('Prescription submitted successfully!');

            setFormData({
                cId: '',
                patientId: '',
                patientName: '',
                diagnosis: '',
                tests: '',
                notes: '',
                admitted: 'No',
            });
        } catch (error) {
            console.error('Error submitting prescription:', error.response?.data || error.message);
            alert(error.response?.data?.message || "Error submitting prescription");
          }
          
    };

    return (
        <div className="form-container">
            <h2>Prescription Form</h2>
            <form onSubmit={handleSubmit} className="styled-form">
                <label>Consultation ID (c_id):</label>
                <input
                    type="text"
                    name="cId"
                    value={formData.cId}
                    onChange={handleChange}
                    required
                />

                <label>Patient ID:</label>
                <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                />

                <label>Patient Name:</label>
                <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                />

                <label>Diagnosis:</label>
                <input
                    type="text"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    required
                />

                <label>Recommended Tests:</label>
                <input
                    type="text"
                    name="tests"
                    value={formData.tests}
                    onChange={handleChange}
                />

                <label>Additional Notes:</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                ></textarea>

                <label>Admit</label>
                <select
                    name="admitted"
                    value={formData.admitted}
                    onChange={handleChange}
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>

                <button type="submit">Submit Prescription</button>
            </form>
        </div>
    );
};

export default Doctor_Prescriptions;
