import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard"; // Import the Dashboard component
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";
import { useNavigate } from "react-router-dom";
// require('dotenv').config();
const Login = () => {
  const [adminID, setadminID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false); // New state to track login status
  const navigate = useNavigate();

  const validateForm = (e) => {
    let error = "";

    // Validate adminID
    if (!adminID) {
      error = "Please enter your adminID address.";
    // } else if (!/\S+@\S+\.\S+/.test(adminID)) {
    //   error = "Please enter a valid adminID address.";
    }

    // Validate password
    if (!password) {
      error += (error ? "\n" : "") + "Please enter your password.";
    } else if (password.length < 8) {
      error += (error ? "\n" : "") + "Password must be at least 8 characters long.";
    }
    if (error) {
      setError(error);
      return false; 
    }
    return true;
  };// Prevent form submission if there are errors

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm(e)) { // Pass the event object to validateForm
      const userCredentials = { adminID, password };
      console.log("User credentials:", userCredentials  )
      // const apiEndpoint = "https://roshni-api.onrender.com/api/admin/login";
      const apiEndpoint = `${import.meta.env.VITE_API_URL}/admin/login`;

      axios.post(apiEndpoint, userCredentials)
        .then((response) => {
          console.log('Login up successful!', response.data);
          if (response.data.success) {
            // Handle successful login (e.g., store token, redirect)
            console.log("Login successful!", response.data);
            var accessToken = response.data.adminData.adminID;
            localStorage.setItem("accessToken", accessToken);
            console.log("Token stored successfully!", accessToken);

            setLoggedIn(true);
            navigate('/dashboard',
              { state: { adminID: response.data.adminData.adminID } }
            ); // Set loggedIn state to true upon successful login
          } else {
            setError(response.data.error || "Login failed."); // Handle API-specific error messages
          }
        })
        .catch((error) => {
          console.error("API error:", error);
          setError("An error occurred. Please try again later."); // Generic error message for user
        });
    }
  };

  return (
    <div className="custom-body-style" style={{ overflow: "hidden" }}>
      <div className="header-container">
        <h1 className="welcome-text">Welcome to Examination Suite by NIIT Foundation</h1>
      </div>
      <hr className="hr-custom" />

      {loggedIn ? ( // Conditionally render Dashboard component if loggedIn is true
        <Dashboard />
      ) : (
        
        <div className="wrapper">
                
          <form onSubmit={handleSubmit} method="POST">
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                placeholder="AdminID"
                name="adminID"
                value={adminID}
                onChange={(e) => setadminID(e.target.value)}
                required
              />
              <FaUser className="icon"/>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon"/>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;