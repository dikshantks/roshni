import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";

import "./Landing.css";
import img1 from "../resources/HiWEP 3.jpg";
import img2 from "../resources/HiWEP 2.jpg";
import img3 from "../resources/l3.jpg";
import { Modal, Form, Button, FloatingLabel } from "react-bootstrap";
function Landing() {
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

export default Landing;