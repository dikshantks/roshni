import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { Button, Card, Form, Modal,Nav,ListGroup, Container} from "react-bootstrap";
import './CreateQuestions.css';
const CreateQuestions = () => {
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: '',
    difficulty: '',
    options: [''],
    correct: '',
  });
  const [updateData, setUpdateData] = useState({
    text: "",
    type: "",
    difficulty: "",
    options: [],
    correct: ""
});
  const location = useLocation();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [lastModifiedQuestion, setLastModifiedQuestion] = useState(null);
  const [modifiedQuestion, setModifiedQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const fetchQuestions = async () => {
    try {
      const { testdetails } = location.state;
      const ID = testdetails.testID;
      console.log(ID);
      const response = await axios.post(`http://localhost:5000/api/tests/${ID}/questions`);
      setQuestions(response.data.map((question) => ({ ...question, isModified: false })));
      console.log(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setData(true);
      setError("An error occurred while fetching questions.");
    }
  };
    useEffect(() => {
    fetchQuestions();

  }, []);  

  useEffect(() => {
    getQuestions();
    console.log(questions)
  }, []);
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/tests/${localStorage.getItem('testID')}/questions`, newQuestion);
      console.log('Question added successfully:', response.data);
      
      // Reset form fields after successful submission
      setNewQuestion({
        text: '',
        type: '',
        difficulty: '',
        options: [''],
        correct: '',
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };
  const handleIncorrectAnswerChange = (questionID, index, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((prevQuestion) =>
        prevQuestion.questionID === questionID
          ? {
              ...prevQuestion,
              options: prevQuestion.options.map((answer, i) =>
                i === index ? value : answer
              ),
              isModified: true,
            }
          : prevQuestion
      )
    );
    const modifiedQuestion = questions.find((question) => question.questionID === questionID);
    modifiedQuestion.options[index] = value;
    modifiedQuestion.isModified = true;
    setModifiedQuestion(modifiedQuestion);
    setLastModifiedQuestion(modifiedQuestion);
  };

  const handleDelete = async (questionID) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tests/${testID}/questions/${questionID}`);
      if (response.status === 200) {
        setQuestions((prevQuestions) => prevQuestions.filter((question) => question.questionID !== questionID));
        console.log("Question deleted successfully");
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      setError("An error occurred while deleting the question.");
    }
  };

  const handleUpdate = (question) => {
    setModifiedQuestion(question);
    setUpdateData({
      text: question.text,
      type: question.type,
      difficulty: question.difficulty,
      options: question.options,
      correct: question.correct
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "options") {
      // Split the comma-separated string into an array
      setUpdateData((prevData) => ({
        ...prevData,
        [name]: value.split(", ")
      }));
    } else {
      setUpdateData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAddOption = () => {
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] });
  };

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (data){
    return (
      <div>
        <hr className="hr-custom" />
          <Container className="mt-5">
            <h1 className="text-center">No Question Found</h1>
            <Button className="add-button align-right buttonss"
                variant="custom"  onClick={() => setShowAddModal(true)}>
              Add Question
            </Button>
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><strong>Add New Question</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='new-quesiton'>
              <Form.Label><strong>Question</strong></Form.Label>
              <Form.Control
                type='text'
                id='text'
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                required
              />
            </Form.Group><br/>
          
            <Form.Group controlId='new-type'>
            <Form.Label><strong>Type</strong></Form.Label>
            <Form.Control
                as="select"
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option value="multiple">Multiple</option>
                <option value="true/false">Text</option>
                </Form.Control>
            </Form.Group><br/>
            <Form.Group controlId="new-difficulty">
              <Form.Label><strong>Difficulty</strong></Form.Label>
              <Form.Control
                as="select"
                id="type"
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                required
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Control>
            </Form.Group>
            <br/>
            <Form.Group controlId="new-options">
              <Form.Label><strong>Options</strong></Form.Label>
              {newQuestion.options.map((answer, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={answer}
                  onChange={(event) => {
                    const updatedAnswers = [...newQuestion.options];
                    updatedAnswers[index] = event.target.value;
                    setNewQuestion({ ...newQuestion, options: updatedAnswers });
                  }}
                />
              ))}
              <Button
                variant="custom"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    options: [...newQuestion.options, ""],
                  })
                }
                className="mt-2 buttonss"
              >
                Add +
              </Button>
            </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="custom" className="buttong" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          
          <Button variant="custom" className="buttong" onClick={handleQuestionSubmit} >
            Add Question
          </Button>
      </Modal.Footer>
        </Modal>
        </Container>
      </div>
    );
  }

  const handleQuestionNavigation = (question,index) => {
    setActiveQuestion(index);
    const questionElement = document.getElementById(question._id);
    questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <div>
    <hr className="hr-custom" />
    
    <div className="centered-container">

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><strong>Add New Question</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group controlId='new-quesiton'>
              <Form.Label><strong>Question</strong></Form.Label>
              <Form.Control
                type='text'
                id='text'
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                required
              />
            </Form.Group><br/>
            <Form.Group controlId="new-options">
              <Form.Label><strong>Options</strong></Form.Label>
              {newQuestion.options.map((answer, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={answer}
                  onChange={(event) => {
                    const updatedAnswers = [...newQuestion.options];
                    updatedAnswers[index] = event.target.value;
                    setNewQuestion({ ...newQuestion, options: updatedAnswers });
                  }}
                />
              ))}
              <Button
                variant="custom"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    options: [...newQuestion.options, ""],
                  })
                }
                className="mt-2 buttonss"
              >
                Add +
              </Button>
            </Form.Group><br/>
            <Form.Group controlId='new-type'>
            <Form.Label><strong>Type</strong></Form.Label>
            <Form.Control
                as="select"
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option value="multiple">Multiple</option>
                <option value="true/false">Text</option>
                </Form.Control>
            </Form.Group><br/>
            <Form.Group controlId="new-difficulty">
              <Form.Label><strong>Difficulty</strong></Form.Label>
              <Form.Control
                as="select"
                id="type"
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                required
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Control>
            </Form.Group><br/>
            <Form.Group controlId='new-correct'>
              <Form.Label><strong>Correct Option</strong></Form.Label>
              <Form.Control
                type='text'
                id='correct'
                value={newQuestion.correct}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                required
              />
            </Form.Group><br/>

            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="custom" className="buttong" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          
          <Button variant="custom" className="buttong" onClick={handleQuestionSubmit} >
            Add Question
          </Button>
         
        </Modal.Footer>
      </Modal>
      
      <div className="row">
        <div className="col-md-4 ">
        
        <div className="sticky-top accordionsss">
        <div className="d-flex justify-content-start mb-4 " >
          <Button className="add-button align-right buttonss"
              variant="custom"  onClick={() => setShowAddModal(true)}>
            Add Question
          </Button>
          </div>
        <Card border="secondary">
        <Card.Body>
        <div className="scrollable-navi ">
          <Card.Title className="d-flex justify-content-center"><strong>Navigate Questions</strong></Card.Title>
          <hr className="my-4" />
          <Nav justify variant="pills" >
            {questions.map((question, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  active={index === activeQuestion}
                  onClick={() => {
                    setActiveQuestion(index);
                    setTimeout(() => {
                      handleQuestionNavigation(question,index);
                    }, 0);
                  }}
                >
                  {index + 1}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          </div>
        </Card.Body>
          </Card>
      </div>
        </div>
        <div className="col-md-8">
        {questions.map((question,index) => (
        <div className="mbb-3" key={question.questionID} id={question.questionID}>
          <Card border="secondary">
            <Card.Body >
              <Card.Title><strong>Question {index+1}</strong></Card.Title>
              <Form >
                <Form.Group controlId={`question-${question.questionID}`}>
                  <Form.Label></Form.Label>
                  <Form.Control
                    type="text"
                    value={question.question}
                    onChange={(event) =>
                      handleQuestionChange(question.questionID, event.target.value)
                    }
                    className="mb-2 fieldd"
                  />
                </Form.Group>
                <Form.Group controlId={`options-${question.questionID}`}>
                  <Form.Label><strong>Options</strong></Form.Label>
                  {question.options.map((options, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      value={options}
                      onChange={(event) =>
                        handleIncorrectAnswerChange(
                          question.questionID,
                          index,
                          event.target.value
                        )
                      }
                      className="mb-2 fieldd"
                    />
                  ))}
                </Form.Group>
                <br/>
         <Form.Group controlId='new-correct'>
              <Form.Label><strong>Correct Option</strong></Form.Label>
              <Form.Control
                type='text'
                id='correct'
                value={newQuestion.correct}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                required
              />
            </Form.Group><br/>

                  <Button
                    variant="custom"
                    onClick={() => handleDelete(question.questionID)}
                    className="btn-auto-width buttonss"
                    style={{ width: "fit-content",marginRight:"10px", marginTop:"10px"}}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="custom"
                    onClick={() => handleUpdate(question.questionID)}
                    className="btn-auto-width buttong"
                    style={{ width: "fit-content",marginRight:"10px", marginTop:"10px" }}
                  >
                    Update
                  </Button>
              </Form>
            </Card.Body>
          </Card>
          {lastModifiedQuestion && lastModifiedQuestion.questionID === question.questionID && (
            <Card border="info" className="updatedCard">
            <Card.Body>
              <Card.Title>Last Modified Question:</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Question:</strong> {lastModifiedQuestion.text}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Correct Answer:</strong>
                  {lastModifiedQuestion.correct}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Incorrect Answers:</strong>{' '}
                  {lastModifiedQuestion.options.join(', ')}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          )}
        </div>
      ))}
      </div>
      </div>
      <br/>
      {showScrollToTop && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <i className="fa fa-arrow-up"></i>
        </div>
      )}
    </div>
    </div>
  );
}



export default CreateQuestions;
