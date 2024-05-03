import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Form, Modal} from "react-bootstrap";
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
            console.log("Data to be passed to ", testData);
            console.log("Test details to be passed to ", testDetails);
    
            // Setting state and navigating
            setQuestions(response.data);
            navigate(`/view-questions/${ID}`, {
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
    const getResults = async (testPin) => {
        try {
            const response = await axios.get("http://localhost:5000/api/results");
            const filteredResults = response.data.filter(result => result.testScores[0] === testPin);
            navigate(`/view-results` ,{state: {data: testPin}});
            return filteredResults;
        } catch (error) {
            console.error("Error fetching results:", error);
            throw error;
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
        <>
      <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Questions</h1>
              <div>
                  <a href="#" onClick={() => setModalIsOpen(true)} className="flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-base md:px-8">
                      Add Test
                  </a>
              </div>
          </div>
      </header>
        <div>
            <hr className="hr-custom" />

            <div className="containerrr mt-5">
                <div className="d-flex justify-content-end mb-4">
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">
                        {tests.map((test, index) => (
                            <div key={test.testID} className="bg-white shadow-md rounded-md p-6">
                                <div className="flex flex-col h-full">
                                    <div className="flex-1">
                                        <p className="text-lg font-semibold leading-6 text-gray-900">{test.subject}</p>
                                        <p className="mt-1 truncate text-base leading-5 text-gray-500">{test.testID}</p>
                                    </div>
                                    <div className="mt-2 flex flex-col sm:flex-row sm:items-end justify-between">
                                        <p className="text-sm leading-6 text-gray-900">Duration: {test.time} minutes</p>
                                        <p className="text-sm leading-6 text-gray-900">Expiry: {new Date(test.expiry).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-2 flex gap-4">
                                    <a href="#" onClick={() => getResults(test.testID)} className="flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-base md:px-8">
                                        View Results
                                    </a>
                                    <a href="#" onClick={() => fetchQuestions(test.testID)} className="flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-base md:px-8">
                                        Edit Test
                                    </a>
                                </div>

                        </div>
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
        </>
    );
}

export default Dash;
