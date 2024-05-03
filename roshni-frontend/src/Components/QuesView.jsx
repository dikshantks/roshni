import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card, Form, Modal, Nav} from "react-bootstrap";
import CreateQuestions from './CreateQuestions'; // Import CreateQuestions component
import { useLocation } from "react-router-dom"; // Add this line
import UpdateQuestions from "./UpdateQuestions";

const TestQuestions = () => {
  const { testID } = useParams();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);  
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
    marks: 0
  });
  const [updateData, setUpdateData] = useState({
      text: "",
      type: "",
      difficulty: "",
      options: [],
      correct: '',
      image:null,
      marks: 0
  });
  const [ID, setID] = useState(null);
   // State variable for selected question to update
   const [selectedQuestion, setSelectedQuestion] = useState(null);
   // State variable to control the visibility of the update modal for each question
   const [showUpdateModals, setShowUpdateModals] = useState({});
   useEffect(() => {
     // Initialize the showUpdateModals state with false for each question
     const initialShowUpdateModals = testData.reduce((acc, question) => {
       acc[question.questionID] = false;
       return acc;
     }, {});
     setShowUpdateModals(initialShowUpdateModals);
   }, [testData]);
 
   // Function to toggle the visibility of the update modal for a specific question
   const toggleUpdateModal = (questionID) => {
     setShowUpdateModals((prevShowUpdateModals) => ({
       ...prevShowUpdateModals,
       [questionID]: !prevShowUpdateModals[questionID],
     }));
   };

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

  
  // const handleUpdate = async (question) => {
  //   console.log(question);
  //   setSelectedQuestion(question);
  //   setUpdateData({
  //     text: question.text,
  //     type: question.type,
  //     difficulty: question.difficulty,
  //     options: question.options.join(", "),
  //     correct: question.correct.join(","),
  //     image: question.image,
  //     marks: question.marks
  //   });
  
  //   try {
  //     const response = await axios.put(`http://localhost:5000/api/tests/${testID}/questions/${question.questionID}`, updateData);
  //     if (response.data.message === "Question updated successfully") {
  //       const updatedQuestions = questions.map((q) => {
  //         if (q.questionID === question.questionID) {
  //           return { ...q, ...updateData };
  //         }
  //         return q;
  //       });
  //       setQuestions(updatedQuestions);
  //       setSelectedQuestion(null);
  //       console.log("Question updated successfully");
  //     } else {
  //       console.error("Failed to update question");
  //     }
  //   } catch (error) {
  //     console.error("Error updating question:", error);
  //     setError("An error occurred while updating the question.");
  //   }
  // };

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
  const updateQuestion = (updatedQuestion, message) => {
    // Update the testData state with the updated question
    const updatedQuestions = testData.map((question) => {
      if (question.questionID === updatedQuestion.questionID) {
        return updatedQuestion;
      }
      return question;
    });
    setTestData(updatedQuestions);
    // Close the modal after successful update
    if (message === "Question updated successfully") {
      handleUpdateCloseModal();
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
  const handleAddModal = (event, testID) => {
    event.preventDefault();
    setID(testID); // Set the testID
    setShowAddModal(true);
  };

  const handleUpdateCloseModal = () => setShowUpdateModal(false);
     // Function to open the update modal for a specific question and set the selected question
     const handleUpdateModal = (question) => {
      setSelectedQuestion(question);
      toggleUpdateModal(question.questionID);
    };
  
  return (
    <>
      <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Questions</h1>
              <div>
                  <a href="#" onClick={(event) => handleAddModal(event, testID)} className="flex items-center justify-center px-3 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-base md:px-8">
                      Add Question
                  </a>
              </div>
          </div>
      </header>

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
