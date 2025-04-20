import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const PatientQuery = () => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async () => {
    if (!patientId) {
      setErrorMessage('Please enter a patient ID.');
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/patient/${patientId}`, { withCredentials: true });
      setPatientData(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Something went wrong, please try again later.');
      setPatientData([]);
    }
  };

  return (
    <div className="patient-query">
      <h2>Query a Patient</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={{ padding: '8px', border: '1px solid #bce0db', borderRadius: '5px', fontSize: '16px', width: '180px', backgroundColor: '#fff', color: '#035c5c' }}
        />
        <button
          onClick={handleSearch}
          style={{ padding: '8px 15px', backgroundColor: '#029e9e', border: 'none', color: 'white', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}
        >
          Search
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {patientData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Age</th>
              <th>Blood Group</th>
              <th>Phone Number</th>
              <th>Consultation Date</th>
              <th>Consultation Time</th>
              <th>Consultation Reason</th>
              <th>Room Number</th>
              <th>Diagnosis</th>
              <th>Recommended Tests</th>
              <th>Additional Notes</th>
              <th>Tests Conducted</th>
              <th>Test Results</th>
              <th>Further Treatment</th>
              <th>Severity</th>
              <th>Test Created At</th>
            </tr>
          </thead>
          <tbody>
            {patientData.map((record, index) => (
              <tr key={index}>
                <td>{record.patient_id}</td>
                <td>{record.patient_name}</td>
                <td>{record.gender}</td>
                <td>{record.dob}</td>
                <td>{record.age}</td>
                <td>{record.blood_group}</td>
                <td>{record.phone_number}</td>
                <td>{record.consultation_date}</td>
                <td>{record.consultation_time}</td>
                <td>{record.consultation_reason}</td>
                <td>{record.consultation_room_number}</td>
                <td>{record.prescription_diagnosis}</td>
                <td>{record.prescription_recommended_tests}</td>
                <td>{record.prescription_notes}</td>
                <td>{record.tests_conducted}</td>
                <td>{record.test_results}</td>
                <td>{record.further_treatment}</td>
                <td>{record.severity}</td>
                <td>{record.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientQuery;