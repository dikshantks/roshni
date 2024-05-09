import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import './EvalAdd.css'
import {Card,Button,Form,FloatingLabel } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddEval = () => {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");
  const [DOB, setDOB] = useState("");
  const [loc, setLocation] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
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
      const evaluatorData = { adminId, firstname, lastname, email, DOB, loc, password };
      const apiEndpoint = "https://roshni-api.onrender.com/api/evaluators/signup/";

      axios
        .post(apiEndpoint, evaluatorData)
        .then((response) => {
          // console.log("Teacher added successfully!", response.data);
          setError("");
          setMessage(formatMessage(response.data));
          console.log("Message:", message);
          window.alert("Signup successful!");
        })
        .catch((error) => {
          console.error("API error:", error);
          setError("An error occurred. Please try again later.");
        });
    }
  };

  const handleCancel = () => {
    window.location.href = "/dashboard";
  };

  const formatMessage = (data) => {
    let message = "";
    for (const key in data) {
      message += `${key}: ${data[key]}\n`;
    }
    return message;
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

          <Form.Group as={Col} controlId="firstName" >
            <FloatingLabel className="mbb-4" 
            controlId="floatingInput" 
            label="First Name">
              
            <Form.Control
              className="fieldss"
              type="text"
              placeholder="Enter first name"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
            />
            </FloatingLabel>
          </Form.Group>
          <br />
          <Form.Group as={Col} controlId="lastName">
            <FloatingLabel controlId="floatingInput"
                  label="Last Name"
                  className="mbb-4">
            <Form.Control
              className="fieldss"
              type="text"
              placeholder="Enter last name"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
            />
            </FloatingLabel>
          </Form.Group>
          </Row>
          <br />
          <Row>
          <Form.Group as={Col} controlId="email">
            <FloatingLabel 
                  controlId="floatingInput"
                  label="Email"
                  className="mbb-4">
            <Form.Control
              className="fieldss"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>
          </Form.Group>
          <br />
          <Form.Group controlId="DOB" >
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              className="fieldss"
              type="date"
              value={DOB}
              placeholder="Enter date of birth"
              onChange={(e) => setDOB(e.target.value)}
              style={{fontSize:"small"}}
            />
          </Form.Group>
          </Row>
          <br />
          <Row>
          <Form.Group as={Col} controlId="loc">
          <FloatingLabel
                  controlId="floatingInput"
                  label="State"
                  className="mbb-4"
                >
            <Form.Control
              className="fieldss"
              type="text"
              placeholder="Enter location"
              value={loc}
              onChange={(e) => setLocation(e.target.value)}
            />
            </FloatingLabel>
          </Form.Group>
          </Row>
          <br />
          <Row>
          <Form.Group as={Col} controlId="password">
          <FloatingLabel
                  controlId="floatingInput"
                  label="Enter Password"
                  className="mbb-4"
                >
            <Form.Control
              className="fieldss"
              type="text"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
      </div>
    </div>
  );
};

export default AddEval;