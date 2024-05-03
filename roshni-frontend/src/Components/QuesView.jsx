import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card, Form, Modal, Nav} from "react-bootstrap";
import CreateQuestions from './CreateQuestions'; // Import CreateQuestions component
import { useLocation } from "react-router-dom"; // Add this line

const TestQuestions = () => {
  const { testID } = useParams();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const location = useLocation();
  const initialTestData = location.state.data.questions;
  const testDet = location.state.testDetails;
  const [testData, setTestData] = useState(initialTestData);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "",
    difficulty: "",
    options: [],
    correct: '',
    image:null,
    marks: ""
  });
  const [updateData, setUpdateData] = useState({
      text: "",
      type: "",
      difficulty: "",
      options: [],
      correct: '',
      image:null,
      marks: ""
  });
  const [ID, setID] = useState(null);
  const [modifiedQuestion, setModifiedQuestion] = useState(null);
  const [lastModifiedQuestion, setLastModifiedQuestion] = useState(null);
  


  const handleDelete = async (questionID) => {
    try {
      console.log("Deleting question with ID:", questionID);
      const response = await axios.delete(`http://localhost:5000/api/tests/${testID}/questions/${questionID}`);
      if (response.data.message === "Question deleted successfully") {
        setTestData(testData.filter(question => question.questionID !== questionID)); 
        console.log("Question deleted successfully");
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      setError("An error occurred while deleting the question.");
    }
  };
  const handleUpdate = async (question) => {
    console.log(question);
    setSelectedQuestion(question);
    setUpdateData({
      text: question.text,
      type: question.type,
      difficulty: question.difficulty,
      options: question.options.join(", "),
      correct: question.correct.join(","),
      image: question.image,
      marks: question.marks
    });
  
    try {
      const response = await axios.put(`http://localhost:5000/api/tests/${testID}/questions/${question.questionID}`, updateData);
      if (response.data.message === "Question updated successfully") {
        const updatedQuestions = questions.map((q) => {
          if (q.questionID === question.questionID) {
            return { ...q, ...updateData };
          }
          return q;
        });
        setQuestions(updatedQuestions);
        setSelectedQuestion(null);
        console.log("Question updated successfully");
      } else {
        console.error("Failed to update question");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      setError("An error occurred while updating the question.");
    }
  };

  const getQuestions = async () => {
    try {
        console.log("Fetching questions for test ID in QuesView:", testID);
        const response = await axios.get(`http://localhost:5000/api/tests/${testID}/questions`);

        // Logging data 
        const quesData = response.data;
        console.log("Data to be passed to quesData", quesData);
        setQuestions(response.data);
        setTestData(response.data.questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        setError("An error occurred while fetching questions.");
    }
};
  const addQuestion = (newQuestion, message) => {
    // Update the testData state with the new question
    setTestData([...testData, newQuestion]);
    // Close the modal after successful addition
    if (message === "Question added successfully") {
      handleAddCloseModal();
    }
};

  useEffect(() => {
    getQuestions();
  }, [testID]);
  
  const handleQuestionNavigation = (question,index) => {
    setActiveQuestion(index);
    const questionElement = document.getElementById(question.questionID);
    questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the selected files
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      image: file, // Update the image property with the selected file
    }));
  };
  const handleAddCloseModal = () => setShowAddModal(false);
  const handleAddModal = (testID) => {
    setID(testID); // Set the testID
    setShowAddModal(true);
  };
  return (
    <>
      <Button variant="primary" onClick={() => handleAddModal(testID)}>
        Add Question
      </Button>

      <Modal show={showAddModal} onHide={handleAddCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateQuestions closeModal={addQuestion} testID={testID}/> {/* Pass handleCloseModal function as prop */}
        </Modal.Body>
      </Modal>
      <div className="row">
        {testData.map((question, index) => (
          <div className="col-md-4 mb-3" key={index}>
            <Card>
              <Card.Body>
                <Card.Title>{question.text}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Type: {question.type}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Difficulty: {question.difficulty}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Options: {question.options}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Correct: {question.correct}</Card.Subtitle>
                <Card.Subtitle className="mb-2 text-muted">Marks: {question.marks}</Card.Subtitle>
                <div className="mt-3">
                  <Button variant="primary" onClick={() => handleUpdate(question)}>Update</Button>
                  <Button variant="danger" onClick={() => handleDelete(question.questionID)} className="ml-2">Delete</Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default TestQuestions;
