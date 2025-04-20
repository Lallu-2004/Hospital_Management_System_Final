

import React, { useState } from "react";
import '../styles/Login.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ handleSubmit triggered");

    try {
   //   const res = await axios.post("http://localhost:5000/api/login", formData);
      const res = await axios.post("http://localhost:5000/api/login", formData, {
        withCredentials: true
      });
      
      console.log("✅ Response:", res.data);
      alert(res.data.message);

  
      const role = res.data.role;

     

      if (role === "doctor") {
        navigate("/doctor");
      } else if (role === "admin") {
        navigate("/admin");
      } else if (role === "frontdesk") {
        navigate("/frontdesk");
      }   else if (role === "patient") {
        navigate("/patient");
      } 
      else if(role === "dataentry"){
        navigate("/dataentry");
      }
      else{
        navigate("/");
      }
      
    } catch (err) {
      console.error("❌ Login error:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Unexpected error occurred.");
      }
    }
  };
return (
  <div className="login-page">
    <div className="login-box">
      <h2 className="login-title">Login to MedPool</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="login-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  </div>
);

//  );
};

export default Login;

// import React, { useState, useEffect } from "react"; // 🆕 added useEffect
// import '../styles/Login.css';
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// axios.defaults.withCredentials = true;

// const Login = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });

//   // 🆕 Check if already logged in
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/check-auth", {
//           withCredentials: true
//         });
//         const role = res.data.role;

//         // Redirect based on role
//         if (role === "doctor") navigate("/doctor");
//         else if (role === "admin") navigate("/admin");
//         else if (role === "frontdesk") navigate("/frontdesk");
//         else if (role === "patient") navigate("/patient");
//         else if (role === "dataentry") navigate("/dataentry");
//         else navigate("/"); // fallback
//       } catch (err) {
//         // Not authenticated — do nothing, show login form
//         console.log("Not logged in, stay on login page.");
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("✅ handleSubmit triggered");

//     try {
//       const res = await axios.post("http://localhost:5000/api/login", formData, {
//         withCredentials: true
//       });
      
//       console.log("✅ Response:", res.data);
//       alert(res.data.message);

//       const role = res.data.role;

//       if (role === "doctor") navigate("/doctor");
//       else if (role === "admin") navigate("/admin");
//       else if (role === "frontdesk") navigate("/frontdesk");
//       else if (role === "patient") navigate("/patient");
//       else if (role === "dataentry") navigate("/dataentry");
//       else navigate("/");

//     } catch (err) {
//       console.error("❌ Login error:", err);
//       if (err.response?.data?.message) {
//         alert(err.response.data.message);
//       } else {
//         alert("Unexpected error occurred.");
//       }
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-box">
//         <h2 className="login-title">Login to MedPool</h2>
//         <form onSubmit={handleSubmit} className="login-form">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             className="login-input"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="login-input"
//             required
//           />
//           <button type="submit" className="login-button">Login</button>
//         </form>
//       </div>
//     </div>
//   );
//  };

// export default Login;



