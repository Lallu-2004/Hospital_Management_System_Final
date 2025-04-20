// src/components/Navbar.js
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/logout',
        {},
        { withCredentials: true } // needed to include cookies
      );

      console.log('Logout successful:', response.data.message);
      navigate('/login'); // redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">MedPool Hospital</div>
      <div className="navbar-logout" onClick={handleLogout}>
        Logout
      </div>
    </nav>
  );
};

export default Navbar;
