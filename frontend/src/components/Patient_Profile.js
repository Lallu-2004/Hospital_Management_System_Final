



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Patient_Profile.css';

// const PatientProfile = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);  // optional loading state
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch('/api/patient', {
//       method: 'GET',
//       credentials: 'include', // include cookies (token)
//     })
//       .then((res) => res.json())
//       .then((result) => {
//         if (result.exists) {
//           setData(result.data);  // show patient data
//         } else {
//           setData(null);         // show "no profile"
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching patient data:', err);
//         setLoading(false);
//       });
//   }, []);

//   const handleAddProfile = () => {
//     window.open('/enter-patient', '_blank');  // Open form in new tab
//   };

//   if (loading) {
//     return <div className="profile-container"><p>Loading...</p></div>;
//   }

//   return (
//     <div className="profile-container">
//       <h2 className="profile-heading">Patient Profile</h2>

//       {data ? (
//         <div className="profile-card">
//           <p><strong>Gender:</strong> {data.gender}</p>
//           <p><strong>Date of Birth:</strong> {data.dob}</p>
//           <p><strong>Age:</strong> {data.age}</p>
//           <p><strong>Blood Group:</strong> {data.blood_group}</p>
//           <p><strong>Phone Number:</strong> {data.phone_number}</p>
//         </div>
//       ) : (
//         <div className="no-profile">
//           <p>Patient profile does not exist.</p>
//           <button onClick={handleAddProfile} className="add-profile-button">
//             Add Profile
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatientProfile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ Import axios
import '../styles/Patient_Profile.css';
import axiosInstance from '../utils/axiosInstance';

const PatientProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axiosInstance.get('/api/patient', {
          withCredentials: true, // ✅ To send cookies (token)
        });

        if (res.status === 200 && res.data.exists) {
          setData(res.data.data);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  const handleAddProfile = () => {
    window.open('/enter-patient', '_blank');
  };

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Patient Profile</h2>

      {data ? (
        <div className="profile-card">
          <p><strong>Gender:</strong> {data.gender}</p>
          <p><strong>Date of Birth:</strong> {data.dob}</p>
          <p><strong>Age:</strong> {data.age}</p>
          <p><strong>Blood Group:</strong> {data.blood_group}</p>
          <p><strong>Phone Number:</strong> {data.phone_number}</p>
        </div>
      ) : (
        <div className="no-profile">
          <p>Patient profile does not exist.</p>
          <button onClick={handleAddProfile} className="add-profile-button">
            Add Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;
