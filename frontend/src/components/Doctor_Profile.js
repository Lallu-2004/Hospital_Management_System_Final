
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Doctor_Profile.css';

// const DoctorProfile = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDoctor = async () => {
//       try {
//         const res = await fetch('/api/doctor', {
//           method: 'GET',
//           credentials: 'include',
//         });

//         const result = await res.json();

//         if (res.ok && result.exists) {
//           setData(result.data);
//         } else {
//           setData(null);
//         }
//       } catch (err) {
//         console.error('Error fetching doctor data:', err);
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDoctor();
//   }, []);

//   const handleAddProfile = () => {
//     window.open('/enter-doctor', '_blank');  // Open form in new tab
//   };

//   if (loading) {
//     return <div className="profile-container"><p>Loading...</p></div>;
//   }
  
//   return (
//     <div className="profile-container">
//       <h2 className="profile-heading">Doctor Profile</h2>

//       {data ? (
//         <div className="profile-card">
//           <p><strong>Doctor ID:</strong> {data.doctor_id}</p>
//           <p><strong>Phone:</strong> {data.phone}</p>
//           <p><strong>Gender:</strong> {data.gender}</p>
//           <p><strong>Specialization:</strong> {data.specialization}</p>
//           <p><strong>Experience:</strong> {data.experience_years} years</p>
//         </div>
//       ) : (
//         <div className="no-profile">
//           <p>Doctor profile does not exist.</p>
//           {/* <button onClick={() => navigate('/enter-doctor')}>Enter Doctor Details</button> */}
//           <button onClick={handleAddProfile} >
//             Add Profile
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorProfile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ Make sure axios is installed
import '../styles/Doctor_Profile.css';
import axiosInstance from '../utils/axiosInstance';
const DoctorProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axiosInstance.get('/api/doctor', {
          withCredentials: true, // ✅ Important to include cookies (session token)
        });

        if (res.status === 200 && res.data.exists) {
          setData(res.data.data);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error('Error fetching doctor data:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const handleAddProfile = () => {
    window.open('/enter-doctor', '_blank');
  };

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Doctor Profile</h2>

      {data ? (
        <div className="profile-card">
          <p><strong>Doctor ID:</strong> {data.doctor_id}</p>
          <p><strong>Phone:</strong> {data.phone}</p>
          <p><strong>Gender:</strong> {data.gender}</p>
          <p><strong>Specialization:</strong> {data.specialization}</p>
          <p><strong>Experience:</strong> {data.experience_years} years</p>
        </div>
      ) : (
        <div className="no-profile">
          <p>Doctor profile does not exist.</p>
          <button onClick={handleAddProfile}>
            Add Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
