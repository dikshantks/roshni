import React, { useState } from 'react';
import axios from "axios";

const SignUp = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    // Replace with your desired validation rules
    if (!organizationName) {
      setError('Please enter an organization name.');
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    // Add more validation rules as needed (e.g., password complexity)

    setError(''); // Clear errors if validation passes
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Send data to your REST API (example for Axios)
      axios.post("http://localhost:5000/api/admin/signup/", {
        organizationName,
        email,
        password,
      })
      .then((response) => {
        console.log("RESS", response.data.message);
        if (response.data.success) {
          console.log('Sign up successful!', response.data);
          setError("Sign Up Successful!");

          // print/()
          // Handle successful signup (e.g., redirect, store token)
        } else {
          setError(response.data.error || 'Sign up failed.');
        }
      })
      .catch((error) => {
        console.error('API error:', error);
        setError("some rror ",error);
        // debug.print(error)
      });
    }
  };


  return (
    <form onSubmit={handleSubmit} method='POST'>
        <h3>Sign Up</h3>
        {error && <p className="error-message">{error}</p>}

        <div className="mb-3">
        <label>Organization name</label>
        <input
            type="text"
            className="form-control"
            placeholder="Enter organization name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
        />
        </div>

        <div className="mb-3">
        <label>Email address</label>
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

        <div className="d-grid">
        <button type="submit" className="btn btn-primary">
            Sign Up
        </button>
        </div>

        <p className="forgot-password text-right">
        Already registered? <a href="/sign-in">Sign in</a>
        </p>
    </form>
  );
};

export default SignUp;
