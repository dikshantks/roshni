import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [adminId, setadminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = (e) => {
    let error = "";

    // Validate adminId
    if (!adminId) {
      error = "Please enter your adminId address.";
    // } else if (!/\S+@\S+\.\S+/.test(adminId)) {
    //   error = "Please enter a valid adminId address.";
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
      const userCredentials = { adminId, password };
      const apiEndpoint = "http://localhost:5000/api/admin/login";
      
      axios.post(apiEndpoint, userCredentials)
        .then((response) => {
          console.log('Login up successful!', response.data);
          if (response.data.success) {
            // Handle successful login (e.g., store token, redirect)
            console.log("Login successful!", response.data);
            localStorage.setItem("accessToken", response.data.token); // Store token securely
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
    <form onSubmit={handleSubmit} method="POST">
      <h3>Sign In</h3>

      {error && <p className="error-message">{error}</p>}

      <div className="mb-3">
        <label>adminId address</label>
        <input
          type="adminId"
          className="form-control"
          placeholder="Enter adminId"
          value={adminId}
          onChange={(e) => setadminId(e.target.value)}
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
        );
    }

export default Login;