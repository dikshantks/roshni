import React, { useState } from "react";
import axios from "axios";
import "./Login.css"
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Button, FloatingLabel } from "react-bootstrap";
import img1 from "../resources/HiWEP 3.jpg";
import img2 from "../resources/HiWEP 2.jpg";
import img3 from "../resources/l3.jpg";

const Login = (props) => {
  const [adminID, setadminID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
            console.log(response.data);
            setError("Sign In Successful!"); // Store token securely
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
    <div style={{ overflow: "hidden" }}>
    <hr className="hr-custom" />

    <h1 style={{ textAlign: "center", paddingBottom: "1vh" }}>
      Welcome to Examination Suite by NIIT Foundation
    </h1>
      <div className="landing-content">
        <Carousel>
          <Carousel.Item interval={5000}>
            <img className="d-block w-100 img-1" src={img1} alt="First slide" />
            <Carousel.Caption></Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <img
              className="d-block w-100 img-2"
              src={img2}
              alt="Second slide"
            />
            <Carousel.Caption></Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <img className="d-block w-100 img-3" src={img3} alt="Third slide" />
            <Carousel.Caption></Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <Modal show={true} onHide={() => {}} disabled={true} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group controlId="adminID">
          <FloatingLabel label="Admin ID">
            <Form.Control
              type="text"
              placeholder="Enter your admin ID"
              value={adminID}
              onChange={(e) => setadminID(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group controlId="password">
          <FloatingLabel label="Password">
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>
        {error && <div className="error-message">{error}</div>}
        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
      </Modal.Body>
      </Modal>
      </div>
    </div>
  );
}


export default Login;