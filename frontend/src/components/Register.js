import React, { useState } from "react";
import axios from "axios";
import '../styles/Register.css';


const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:5000/api/register", formData);
      alert(res.data.message); 
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong during registration.");
    }
  };
  

  return (

    // <div style={{ maxWidth: "400px", margin: "auto", paddingTop: "50px" }}>
    //   <h2>Patient Registration</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       name="name"
    //       placeholder="Full Name"
    //       value={formData.name}
    //       onChange={handleChange}
    //       required
    //     /><br />
    //     <input
    //       type="email"
    //       name="email"
    //       placeholder="Email"
    //       value={formData.email}
    //       onChange={handleChange}
    //       required
    //     /><br />
    //     <input
    //       type="password"
    //       name="password"
    //       placeholder="Password"
    //       value={formData.password}
    //       onChange={handleChange}
    //       required
    //     /><br />
    //     <button type="submit">Register</button>
    //   </form>
    // </div>

  //   <div className="register-page">
  //   <div className="register-box">
  //     <h2 className="register-title">Patient Registration</h2>
  //     <form onSubmit={handleSubmit} className="register-form">
  //       <input
  //         type="text"
  //         placeholder="Full Name"
  //         value={formData.name}
  //         onChange={handleChange}
  //         className="register-input"
  //         required
  //       />
  //       <input
  //         type="email"
  //         placeholder="Email"
  //         value={formData.email}
  //         onChange={handleChange}
  //         className="register-input"
  //         required
  //       />
  //       <input
  //         type="password"
  //         placeholder="Password"
  //         value={formData.password}
  //         onChange={handleChange}
  //         className="register-input"
  //         required
  //       />
  //       <button type="submit" className="register-button">Register</button>
  //     </form>
  //   </div>
  // </div>
  <div className="register-page">
  <div className="register-box">
    <h2 className="register-title">Patient Registration</h2>
    <form onSubmit={handleSubmit} className="register-form">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="register-input"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="register-input"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="register-input"
        required
      />
      <button type="submit" className="register-button">Register</button>
    </form>
  </div>
</div>

  );
};

export default Register;
