import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Form, Modal, Badge } from "react-bootstrap";
import "./dash.css"
function Dash() {
    const [tests, setTests] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [subject, setSubject] = useState(""); 
    const [imageUrl, setImageUrl] = useState(""); 
    const [time, setTime] = useState(""); 
    const [expiry, setExpiry] = useState(""); 
    const [error, setError] = useState("");
    const [testID, setTestID] = useState("");
    const [testCreated, setTestCreated] = useState(false);
    const [questions,setQuestions] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchTests();
    }, [modalIsOpen]);

    const fetchTests = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/tests");
            setTests(response.data);
        } catch (error) {
            console.error("Error fetching tests:", error);
            setError("An error occurred while fetching tests.");
        }
    };
    const fetchQuestions = async (ID) => {
        try {
            console.log("Fetching questions for test ID:", ID);
            const response = await axios.get(`http://localhost:5000/api/tests/${ID}/questions`);
    
            // Logging data before navigating
            const testData = response.data;
            const testDetails = tests.find((test) => test.testID === ID);
            console.log("Data to be passed to /createQuestions:", testData);
            console.log("Test details to be passed to /createQuestions:", testDetails);
    
            // Setting state and navigating
            setQuestions(response.data);
            navigate("/createQuestions", {
                state: {
                    data: testData,
                    testdetails: testDetails
                }
            });
        } catch (error) {
            console.error("Error fetching questions:", error);
            setError("An error occurred while fetching questions.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subject || !time || !expiry) {
            setError('Please fill in all required fields.');
            return;
        }

        setError('');

        try {
            const response = await axios.post("http://localhost:5000/api/tests/create", {
                subject,
                time,
                expiry,
                imageUrl,
                createDate: new Date().toISOString().slice(0, 10)
            });

            if (response.data.success) {
                setError("Test Created Successfully!");
                setTestID(response.data.testID);
                setTestCreated(true);
                setModalIsOpen(false);
                localStorage.setItem('testID', response.data.testID);
            } else {
                setError(response.data.error || 'Test creation failed.');
            }
        } catch (error) {
            console.error('Error creating test:', error);
            setError("Error creating test: " + error.message);
        }
    };

    return (
        <div>
            <hr className="hr-custom" />

            <div className="containerrr mt-5">
                <div className="d-flex justify-content-end mb-4">
                    <Button
                        variant="custom"
                        className="buttong"
                        onClick={() => setModalIsOpen(true)}
                    >
                        + Add Test
                    </Button>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {tests.map((test, index) => (
                        <div className="col" key={test.id}>
                            <Card className="marginforCard">
                                {/* Add Card Image */}
                                <Card.Img
                                    variant="top"
                                    style={{ width: "100%", height: "20vh" }}
                                    src={test.imageUrl}
                                    alt="Test Image"
                                />

                                <Card.Body>
                                    <Card.Title className="modallabels">
                                        {test.subject}
                                    </Card.Title>
                                    <hr />
                                    <Card.Text>
                                        <strong>Pin:</strong> {test.testID}
                                        <br />
                                        {/* <strong>Number of Questions:</strong> {test.amount}
                                        <br /> */}
                                        <strong>Time Duration (Mins):</strong> {test.time}
                                        <br />
                                        <strong>Expiry:</strong>{" "}
                                        {new Date(test.expiry).toLocaleDateString()}
                                    </Card.Text>
                                    <Button
                                        variant="primary"
                                        className="buttonss"
                                        onClick={() => fetchQuestions(test.testID)}
                                        style={{ marginLeft: "10px", marginTop: "2px" }}
                                    >
                                        Edit Test
                                    </Button>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="modallabels">Add Test</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicNumber">
                            <Form.Label className="modallabels">Topic</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name of test"
                                value={subject}
                                onChange={(event) => setSubject(event.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formBasicImageURL">
                            <Form.Label className="modallabels">Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image URL for the test"
                                value={imageUrl}
                                onChange={(event) => setImageUrl(event.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formBasicTime">
                            <Form.Label className="modallabels">
                                Time Duration (in minutes)
                            </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter time duration (in minutes)"
                                min="1"
                                value={time}
                                onChange={(event) => setTime(event.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group controlId="formBasicExpiry">
                            <Form.Label className="modallabels">Expiry Date</Form.Label>
                            <Form.Control
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                value={expiry}
                                onChange={(event) => setExpiry(event.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Button variant="custom " className="buttonss" type="submit">
                            Add Test
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Dash;
