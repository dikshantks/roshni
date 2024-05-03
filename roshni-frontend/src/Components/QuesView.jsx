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
  const handleAddModal = (event, testID) => {
    event.preventDefault();
    setID(testID); // Set the testID
    setShowAddModal(true);
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

      <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-10">
    {testData.map((question, index) => (
        <div className="dark:bg-grey-500 m-5 dark:text-black rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl" key={index}>
            <div className="font-semibold text-lg mb-4">Question {index + 1}: <span className="text-black">{question.text}</span></div>
            <div><span className="font-semibold">Type:</span> <span className="text-black">{question.type}</span></div>
            <div><span className="font-semibold">Difficulty:</span> <span className="text-black">{question.difficulty}</span></div>
            <div><span className="font-semibold">Options: </span>
                {question.options.map((option, idx) => (
                    <span key={idx} className="text-black">{option}{idx !== question.options.length - 1 && ", "}</span>
                ))}
            </div>            
            <div><span className="font-semibold">Correct Answer:</span> <span className="text-black">{question.correct}</span></div>
            <div><span className="font-semibold">Marks:</span> <span className="text-black">{question.marks}</span></div>
            <div className="mt-4 flex gap-4">
              <a href="#" onClick={() => handleUpdate(question)} className="flex items-center justify-center px-3 py-2 md:px-4 md:py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg">
                  Update
              </a>
              <a href="#" onClick={() => handleDelete(question.questionID)} className="flex items-center justify-center px-3 py-2 md:px-4 md:py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:text-lg">
                  Delete
              </a>
            </div>
        </div>
    ))}
</div>

    </>
  );
};

export default TestQuestions;
