// // import React, { useState } from 'react';
// // import '../styles/Enter_Patient_Details.css';

// // const Enter_Patient_Details = () => {
// //   const [formData, setFormData] = useState({
// //     gender: '',
// //     dob: '',
// //     age: '',
// //     blood_group: '',
// //     phone_number: '',
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({
// //       ...prev,
// //       [name]: value,
// //     }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     console.log(formData); // replace with actual submission logic
// //   };

// //   return (
// //     <div className="patient-form-container">
// //       <h2>Enter Patient Details</h2>
// //       <form className="patient-form" onSubmit={handleSubmit}>
// //         <label>
// //           Gender:
// //           <select name="gender" value={formData.gender} onChange={handleChange} required>
// //             <option value="">Select</option>
// //             <option value="Male">Male</option>
// //             <option value="Female">Female</option>
// //             <option value="Other">Other</option>
// //           </select>
// //         </label>

// //         <label>
// //           Date of Birth:
// //           <input
// //             type="date"
// //             name="dob"
// //             value={formData.dob}
// //             onChange={handleChange}
// //             required
// //           />
// //         </label>

// //         <label>
// //           Age:
// //           <input
// //             type="number"
// //             name="age"
// //             min="0"
// //             value={formData.age}
// //             onChange={handleChange}
// //             required
// //           />
// //         </label>

// //         <label>
// //           Blood Group:
// //           <input
// //             type="text"
// //             name="blood_group"
// //             value={formData.blood_group}
// //             onChange={handleChange}
// //             placeholder="e.g. A+, O-, AB+"
// //             required
// //           />
// //         </label>

// //         <label>
// //           Phone Number:
// //           <input
// //             type="tel"
// //             name="phone_number"
// //             value={formData.phone_number}
// //             onChange={handleChange}
// //             placeholder="e.g. +91XXXXXXXXXX"
// //             required
// //           />
// //         </label>

// //         <button type="submit">Submit</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default Enter_Patient_Details;

// import React, { useState } from 'react';
// import '../styles/Enter_Patient_Details.css';

// const Enter_Patient_Details = () => {
//   const [formData, setFormData] = useState({
//     gender: '',
//     dob: '',
//     age: '',
//     blood_group: '',
//     phone_number: '',
//   });

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
//         credentials: 'include', // 🔑 important for sending cookies (JWT token)
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert('Patient details submitted successfully!');
//         console.log(data);
//       } else {
//         alert(data.message || 'Error submitting patient details.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Something went wrong while submitting.');
//     }
//   };

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
import '../styles/Enter_Patient_Details.css';

const Enter_Patient_Details = () => {
  const [formData, setFormData] = useState({
    gender: '',
    dob: '',
    age: '',
    blood_group: '',
    phone_number: '',
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
      const res = await fetch('/api/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Error submitting patient details.');
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
        <p>Your details have been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="patient-form-container">
      <h2>Enter Patient Details</h2>
      <form className="patient-form" onSubmit={handleSubmit}>
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
          Date of Birth:
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Age:
          <input
            type="number"
            name="age"
            min="0"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Blood Group:
          <input
            type="text"
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            placeholder="e.g. A+, O-, AB+"
            required
          />
        </label>

        <label>
          Phone Number:
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="e.g. +91XXXXXXXXXX"
            required
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Enter_Patient_Details;
