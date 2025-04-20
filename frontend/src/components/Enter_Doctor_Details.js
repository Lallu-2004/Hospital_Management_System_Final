// import React, { useState } from 'react';
// import '../styles/Enter_Doctor_Details.css';

// const Enter_Patient_Details = () => {
//   const [formData, setFormData] = useState({
//     gender: '',
//     dob: '',
//     age: '',
//     blood_group: '',
//     phone_number: '',
//   });

//   const [submitted, setSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('/api/patient', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setSubmitted(true);
//       } else {
//         alert(data.message || 'Error submitting patient details.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Something went wrong while submitting.');
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="thank-you-container">
//         <h2>Thank You!</h2>
//         <p>Your details have been submitted successfully.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="patient-form-container">
//       <h2>Enter Patient Details</h2>
//       <form className="patient-form" onSubmit={handleSubmit}>
//         <label>
//           Gender:
//           <select name="gender" value={formData.gender} onChange={handleChange} required>
//             <option value="">Select</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//             <option value="Other">Other</option>
//           </select>
//         </label>

//         <label>
//           Date of Birth:
//           <input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Age:
//           <input
//             type="number"
//             name="age"
//             min="0"
//             value={formData.age}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Blood Group:
//           <input
//             type="text"
//             name="blood_group"
//             value={formData.blood_group}
//             onChange={handleChange}
//             placeholder="e.g. A+, O-, AB+"
//             required
//           />
//         </label>

//         <label>
//           Phone Number:
//           <input
//             type="tel"
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleChange}
//             placeholder="e.g. +91XXXXXXXXXX"
//             required
//           />
//         </label>

//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default Enter_Patient_Details;
import React, { useState } from 'react';
import '../styles/Enter_Patient_Details.css'; // You can keep or rename this if needed

const Enter_Doctor_Details = () => {
  const [formData, setFormData] = useState({
    phone: '',
    gender: '',
    specialization: '',
    experience_years: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // needed for cookie-based JWT
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Error submitting doctor details.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while submitting.');
    }
  };

  if (submitted) {
    return (
      <div className="thank-you-container">
        <h2>Thank You!</h2>
        <p>Doctor details have been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="patient-form-container">
      <h2>Enter Doctor Details</h2>
      <form className="patient-form" onSubmit={handleSubmit}>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91XXXXXXXXXX"
            required
          />
        </label>

        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Specialization:
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g. Cardiologist, Orthopedic"
            required
          />
        </label>

        <label>
          Years of Experience:
          <input
            type="number"
            name="experience_years"
            min="0"
            value={formData.experience_years}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Enter_Doctor_Details;
