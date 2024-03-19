import React, { useState } from "react";
import axios from "axios";

const FundAdd = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const validateForm = () => {
    let error = "";

    // Validate organizationName
    if (!organizationName) {
      error = "Please enter the organization name.";
    }

    // Validate email
    if (!email) {
      error += (error ? "\n" : "") + "Please enter the email.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error += (error ? "\n" : "") + "Please enter a valid email.";
    }

    // Validate password
    if (!password) {
      error += (error ? "\n" : "") + "Please enter the password.";
    } else if (password.length < 8) {
      error += (error ? "\n" : "") + "Password must be at least 8 characters long.";
    }

    // Validate locations
    if (!locations || locations.length === 0) {
      error += (error ? "\n" : "") + "Please enter at least one location.";
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

    if (validateForm()) {
      const funderData = { organizationName, email, password, locations };
      const adminId = localStorage.getItem("accessToken"); // Replace with actual admin ID
      const apiEndpoint = `http://localhost:5000/api/admin/${adminId}/funders`;

      axios
        .post(apiEndpoint, funderData)
        .then((response) => {
          console.log("Funder added successfully!", response.data);
          setError("");
          setMessage(formatMessage(response.data));
        })
        .catch((error) => {
          console.error("API error:", error);
          setError("An error occurred. Please try again later.");
        });
    }
  };

  const formatMessage = (data) => {
    let message = "";
    for (const key in data) {
      message += `${key}: ${data[key]}\n`;
    }
    return message;
  };

  return (
    <div>
      <form onSubmit={handleSubmit} method="POST">
        <h3>Add Funder</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label>Organization Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter organization name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <label>Locations</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter locations separated by commas"
            value={locations}
            onChange={(e) => setLocations(e.target.value.split(","))}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>

      {message && (
        <div className="alert alert-success">
          <pre>{message}</pre>
        </div>
      )}
    </div>
  );
};

export default FundAdd;
