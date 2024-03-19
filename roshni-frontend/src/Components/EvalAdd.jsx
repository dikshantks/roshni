import React, { useState } from "react";
import axios from "axios";

const AddEval = () => {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [DOB, setDOB] = useState("");
  const [loc, setLocation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const validateForm = () => {
    let error = "";

    // Validate firstname
    if (!firstname) {
      error = "Please enter the first name.";
    }

    // Validate lastname
    if (!lastname) {
      error += (error ? "\n" : "") + "Please enter the last name.";
    }

    // Validate email
    if (!email) {
      error += (error ? "\n" : "") + "Please enter the email.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error += (error ? "\n" : "") + "Please enter a valid email.";
    }

    // Validate DOB
    if (!DOB) {
      error += (error ? "\n" : "") + "Please enter the date of birth.";
    }

    // Validate location
    if (!loc) {
      error += (error ? "\n" : "") + "Please enter the location.";
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
      const adminId = localStorage.getItem("accessToken");
      const evaluatorData = {adminId, firstname, lastname, email, DOB, loc };
      const apiEndpoint = "http://localhost:5000/api/evaluators/signup/";
       
      axios
        .post(apiEndpoint, evaluatorData)
        .then((response) => {
        console.log("Teacher added successfully!", response.data);
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
        <h3>Add Teacher</h3>

        {error && <p className="error-message">{error}</p>}

        <div className="mb-3">
            <label>First Name</label>
            <input
            type="text"
            className="form-control"
            placeholder="Enter first name"
            value={firstname}
            onChange={(e) => setfirstname(e.target.value)}
            />
        </div>

        <div className="mb-3">
            <label>Last Name</label>
            <input
            type="text"
            className="form-control"
            placeholder="Enter last name"
            value={lastname}
            onChange={(e) => setlastname(e.target.value)}
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
            <label>Date of Birth</label>
            <input
            type="date"
            className="form-control"
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
            />
        </div>

        <div className="mb-3">
            <label>Location</label>
            <input
            type="text"
            className="form-control"
            placeholder="Enter location"
            value={loc}
            onChange={(e) => setLocation(e.target.value)}
            />
        </div>

        <div className="d-grid">
            <button type="submit" className="btn btn-primary">
            Submit
            </button>
        </div>
        </form>

        {error && (
            <div className="alert alert-danger">
                {error}
            </div>
        )}

        {message && (
            <div className="alert alert-success">
                <pre>{message}</pre>
            </div>
        )}
    </div>
  );
};

export default AddEval;
