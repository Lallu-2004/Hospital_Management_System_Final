// src/components/DataEntry.js
import React, { useEffect,useState } from 'react';

import axios from 'axios';
import Navbar from './Navbar';
import axiosInstance from '../utils/axiosInstance';

import '../styles/DataEntry.css';

// const Navbar = () => (
//     <div className="navbar">
//         <div className="navbar-title">🏥 MedPool Hospital</div>
//         <button className="logout-button">Logout</button>
//     </div>
// );

const Sidebar = ({ setView }) => (
    <div className="sidebar">
        <h2 className="sidebar-title" onClick={() => setView('dashboard')}>Data Entry</h2>
        <ul className="sidebar-nav">
            <li onClick={() => setView('prescription')}>Prescription List</li>
            <li onClick={() => setView('testEntry')}>Test Entry</li>
            <li onClick={() => setView('testResults')}>Test Results</li>
        </ul>
    </div>
);

const DashboardMain = ({ setView }) => (
    <div className="main-cards">
        <h2 className="welcome-text">WELCOME DATA ENTRY OPERATOR</h2>
        <div className="card-container">
            <div className="card" onClick={() => setView('prescription')}>
                <h3>Prescription List</h3>
                <p>View all prescriptions</p>
            </div>
            <div className="card" onClick={() => setView('testEntry')}>
                <h3>Test Entry</h3>
                <p>Enter test results</p>
            </div>
            <div className="card" onClick={() => setView('testResults')}>
                <h3>Test Results</h3>
                <p>View submitted results</p>
            </div>
        </div>
    </div>
);

// const PrescriptionList = () => (
//     <div className="form-card">
//         <h2>Prescription List</h2>
//         <table>
//             <thead>
//                 <tr>
//                     <th>Prescription ID</th>
//                     <th>Doctor ID</th>
//                     <th>Patient ID</th>
//                     <th>Medications</th>
//                     <th>Date</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td>RX001</td>
//                     <td>D101</td>
//                     <td>P202</td>
//                     <td>Paracetamol</td>
//                     <td>2025-04-10</td>
//                 </tr>
//                 <tr>
//                     <td>RX002</td>
//                     <td>D102</td>
//                     <td>P203</td>
//                     <td>Ibuprofen</td>
//                     <td>2025-04-12</td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>
// );

// const PrescriptionList = () => (
//     <div className="form-card">
//       <h2>Prescription List</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Prescription ID</th> {/* p_id */}
//             <th>Consultation ID</th> {/* c_id */}
//             <th>Patient ID</th>
//             <th>Doctor ID</th>
//             <th>Diagnosis</th>
//             <th>Recommended Tests</th>
//             <th>Additional Notes</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>P001</td>
//             <td>C001</td>
//             <td>PT101</td>
//             <td>DR201</td>
//             <td>Viral Fever</td>
//             <td>Blood Test, CBC</td>
//             <td>Stay hydrated and rest</td>
//           </tr>
//           <tr>
//             <td>P002</td>
//             <td>C002</td>
//             <td>PT102</td>
//             <td>DR202</td>
//             <td>Flu</td>
//             <td>Chest X-ray</td>
//             <td>Check for cold symptoms again in 3 days</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );


const PrescriptionList = () => {
    const [prescriptions, setPrescriptions] = useState([]);
  
    useEffect(() => {
      const fetchPrescriptions = async () => {
        try {
          const res = await axiosInstance.get('/api/prescriptions-dashboard'); // This will use the role-based API
          setPrescriptions(res.data);
        } catch (err) {
          console.error("Failed to fetch prescriptions:", err);
        }
      };
  
      fetchPrescriptions();
    }, []);
  
    return (
      <div className="form-card">
        <h2>Prescription List</h2>
        <table>
          <thead>
            <tr>
              <th>Prescription ID</th>
              <th>Consultation ID</th>
              <th>Patient ID</th>
              <th>Doctor ID</th>
              <th>Diagnosis</th>
              <th>Recommended Tests</th>
              <th>Additional Notes</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p.p_id}>
                <td>{p.p_id}</td>
                <td>{p.c_id}</td>
                <td>{p.patient_id}</td>
                <td>{p.doctor_id}</td>
                <td>{p.diagnosis}</td>
                <td>{p.recommended_tests}</td>
                <td>{p.additional_notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
// const TestEntry = () => {
//     const [formData, setFormData] = useState({
//         prescriptionId: '',
//         tests: '',
//         results: '',
//         treatment: ''
//     });

//     const handleChange = (e) => {
//         setFormData(prev => ({
//             ...prev,
//             [e.target.name]: e.target.value
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Submitted:", formData);
//     };

//     return (
//         <div className="form-card">
//             <h2>Enter Test Results</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>Prescription ID</label>
//                 <input name="prescriptionId" onChange={handleChange} value={formData.prescriptionId} />
//                 <label>Tests Conducted</label>
//                 <input name="tests" onChange={handleChange} value={formData.tests} />
//                 <label>Test Results</label>
//                 <input name="results" onChange={handleChange} value={formData.results} />
//                 <label>Further Treatment</label>
//                 <input name="treatment" onChange={handleChange} value={formData.treatment} />
//                 <button type="submit">Submit</button>
//             </form>
//         </div>
//     );
// };

const TestEntry = () => {
    const [formData, setFormData] = useState({
        prescriptionId: '',
        tests: '',
        results: '',
        treatment: '',
        severity: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('/api/tests', {
                prescription_id: formData.prescriptionId,
                tests_conducted: formData.tests,
                test_results: formData.results,
                further_treatment: formData.treatment,
                severity: formData.severity
            });
            alert("Test data submitted successfully!");
            console.log(res.data);

            // Optional: Reset form after successful submission
            setFormData({
                prescriptionId: '',
                tests: '',
                results: '',
                treatment: '',
                severity:''
            });

        } catch (err) {
            console.error("Error submitting test data:", err);
            alert("Failed to submit test data.");
        }
    };

    return (
        <div className="form-card">
            <h2>Enter Test Results</h2>
            <form onSubmit={handleSubmit}>
                <label>Prescription ID</label>
                <input name="prescriptionId" onChange={handleChange} value={formData.prescriptionId} />

                <label>Tests Conducted</label>
                <input name="tests" onChange={handleChange} value={formData.tests} />

                <label>Test Results</label>
                <input name="results" onChange={handleChange} value={formData.results} />

                <label>Further Treatment</label>
                <input name="treatment" onChange={handleChange} value={formData.treatment} />
                  
                {/* <label>Severity level</label>
                <input name="treatment" onChange={handleChange} value={formData.severity} /> */}

<label>Severity level</label>
<select name="severity" onChange={handleChange} value={formData.severity}>
<option value="">Select severity</option>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};


// const TestResults = () => (
//     <div className="form-card">
//         <h2>Test Results</h2>
//         <table>
//             <thead>
//                 <tr>
//                     <th>Test ID</th>
//                     <th>Doctor ID</th>
//                     <th>Patient ID</th>
//                     <th>Tests</th>
//                     <th>Results</th>
//                     <th>Treatment</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td>T001</td>
//                     <td>D101</td>
//                     <td>P202</td>
//                     <td>Blood Test</td>
//                     <td>Normal</td>
//                     <td>Multivitamins</td>
//                 </tr>
//                 <tr>
//                     <td>T002</td>
//                     <td>D102</td>
//                     <td>P203</td>
//                     <td>X-Ray</td>
//                     <td>Fracture</td>
//                     <td>Cast</td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>
// );

// const TestResults = () => (
//     <div className="form-card">
//         <h2>Test Results</h2>
//         <table>
//             <thead>
//                 <tr>
//                     <th>Test ID</th>
//                     <th>Prescription ID</th>
//                     <th>Tests Conducted</th>
//                     <th>Test Results</th>
//                     <th>Further Treatment</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 <tr>
//                     <td>T001</td>
//                     <td>RX101</td>
//                     <td>Blood Test</td>
//                     <td>Normal</td>
//                     <td>Multivitamins</td>
//                 </tr>
//                 <tr>
//                     <td>T002</td>
//                     <td>RX102</td>
//                     <td>X-Ray</td>
//                     <td>Fracture</td>
//                     <td>Cast</td>
//                 </tr>
//             </tbody>
//         </table>
//     </div>
// );

const TestResults = () => {
    const [testData, setTestData] = useState([]);
  
    useEffect(() => {
      axiosInstance.get("/api/tests")
        .then(res => setTestData(res.data))
        .catch(err => console.error("Error fetching test results:", err));
    }, []);
  
    return (
      <div className="form-card">
        <h2>Test Results</h2>
        <table>
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Prescription ID</th>
              <th>Tests Conducted</th>
              <th>Test Results</th>
              <th>Further Treatment</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {testData.map((test) => (
              <tr key={test.test_id}>
                <td>{test.test_id}</td>
                <td>{test.prescription_id}</td>
                <td>{test.tests_conducted}</td>
                <td>{test.test_results}</td>
                <td>{test.further_treatment}</td>
                <td>{test.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

const DataEntry = () => {
    const [view, setView] = useState('dashboard');

    let content;
    if (view === 'prescription') content = <PrescriptionList />;
    else if (view === 'testEntry') content = <TestEntry />;
    else if (view === 'testResults') content = <TestResults />;
    else content = <DashboardMain setView={setView} />;

    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <Sidebar setView={setView} />
                <div className="content-area">{content}</div>
            </div>
        </div>
    );
};

export default DataEntry;