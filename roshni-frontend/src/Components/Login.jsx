import React, { useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard"; // Import the Dashboard component

const Login = () => {
  const [adminID, setadminID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false); // New state to track login status

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

    // Display error message if any
    if (error) {
      setError(error);
      return false; // Prevent form submission if there are errors
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm(e)) { // Pass the event object to validateForm
      const userCredentials = { adminID, password };
      const apiEndpoint = "http://localhost:5000/api/admin/login";
      
      axios.post(apiEndpoint, userCredentials)
        .then((response) => {
          console.log('Login up successful!', response.data);
          if (response.data.success) {
            // Handle successful login (e.g., store token, redirect)
            console.log("Login successful!", response.data);
            var accessToken = response.data.adminData.adminID;
            localStorage.setItem("accessToken", accessToken);
            console.log("Token stored successfully!", accessToken);

            setLoggedIn(true); // Set loggedIn state to true upon successful login
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
    <div>
      {loggedIn ? ( // Conditionally render Dashboard component if loggedIn is true
        <Dashboard />
      ) : (
        <form onSubmit={handleSubmit} method="POST">
          <h3>Sign In</h3>

          {error && <p className="error-message">{error}</p>}

          <div className="mb-3">
            <label>adminID</label>
            <input
              type="adminID"
              className="form-control"
              placeholder="Enter adminID"
              value={adminID}
              onChange={(e) => setadminID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>

          <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
