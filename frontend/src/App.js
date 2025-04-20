import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import axios from "axios";
import Doctor_Dashboard from "./components/Doctor_Dashboard";
import Patient_Dashboard from "./components/Patient_Dashboard";
import FrontDesk from "./components/FrontDesk";
import Admin from "./components/Admin";
import DataEntry from "./components/DataEntry";
import ProtectedRoute from "./components/ProtectedRoute";
import Enter_Patient_Details from "./components/Enter_Patient_Details";
import Enter_Doctor_Details from "./components/Enter_Doctor_Details";
import Home from "./components/Home";

axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} /> 

        <Route path="/login" element={<Login />} />
     
        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute requiredRole="doctor">
              <Doctor_Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/*"
          element={
            <ProtectedRoute requiredRole="patient">
              <Patient_Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/frontdesk/*"
          element={
            <ProtectedRoute requiredRole="frontdesk">
             <FrontDesk/>
            </ProtectedRoute>
          }
        />
          <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
       
       <Route
          path="/dataentry/*"
          element={
            <ProtectedRoute requiredRole="dataentry">
              <DataEntry />
            </ProtectedRoute>
          }
        />
                <Route path="/enter-patient" element={<Enter_Patient_Details />} />

                <Route path="/enter-doctor" element={<Enter_Doctor_Details />} />
                
                

{/* <Route path="/dataentry" element={<DataEntry />} /> */}


      </Routes>
    </Router>
  );
}

export default App;
