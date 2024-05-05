import React, { useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import {Card,Button,Form,FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./FundAdd.css"
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
      const apiEndpoint = `https://roshni-api.onrender.com/api/admin/${adminId}/funders`;

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

  const handleCancel = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="imc">
      <div className="bgg">
      <Card className="containerr"> 
          <Card.Body>
            <Card.Title as="h3" className="text">Add Facilitator</Card.Title>
            <br/>
        <Form onSubmit={handleSubmit}>
        <Row>
            {error && <p className="error-message">{error}</p>}
        <Form.Group as={Col} controlId="organizationName">
        <FloatingLabel className="mbb-4" 
            controlId="floatingInput" 
            label="Organization Name">
          <Form.Control
            type="text"
            className="fieldss"
            placeholder="Enter organization name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
          />
          </FloatingLabel>
        </Form.Group>
        < br/>
        <Form.Group as={Col} controlId="email">
          <FloatingLabel className="mbb-4" controlId="floatingInput" label="Email">
            <Form.Control
              type="email"
              className="fieldss"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>
        </Row>
        <br />
        <Row>
        <Form.Group as={Col} controlId="password">
          <FloatingLabel className="mbb-4" controlId="floatingInput" label="Password">
            <Form.Control
              type="password"
              className="fieldss"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>
        <br />
        <Form.Group as={Col} controlId="locations">
        <FloatingLabel className="mbb-4" controlId="floatingInput" label="Locations">
          <Form.Control
            type="text"
            className="fieldss"
            placeholder="Enter locations separated by commas"
            value={locations}
            onChange={(e) => setLocations(e.target.value.split(","))}
          />
        </FloatingLabel>
        </Form.Group>
        </Row>
        <br />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="success" className="btttn" type="submit" style={{ marginRight: '1rem' }}>
              Submit
            </Button>
            <br />
            <Button type="button" className="btttn" onClick={handleCancel} style={{ marginRight: '1rem' }}>
              Cancel
            </Button>
          </div>
          </Form>
        </Card.Body>
      </Card>

      {message && (
        <div className="alert alert-success">
          <pre>{message}</pre>
        </div>
      )}
    </div>
    </div>
  );
};

export default FundAdd;
