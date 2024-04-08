import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TestQuestions = () => {
    const { testID } = useParams();
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [updateData, setUpdateData] = useState({
        text: "",
        type: "",
        difficulty: "",
        options: [],
        correct: ""
    });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tests/${testID}/questions`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("An error occurred while fetching questions.");
    }
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
    setSelectedQuestion(question);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/tests/${testID}/questions/${selectedQuestion.questionID}`, updateData);
      if (response.status === 200) {
        const updatedQuestions = questions.map((question) => {
          if (question.questionID === selectedQuestion.questionID) {
            return { ...question, ...updateData };
          }
          return question;
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

  return (
    <div>
      <h3>Questions for Test</h3>

      {error && <p className="error-message">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Text</th>
            <th>Type</th>
            <th>Difficulty</th>
            <th>Options</th>
            <th>Correct</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.questionID}>
              <td>{question.text}</td>
              <td>{question.type}</td>
              <td>{question.difficulty}</td>
              <td>{Array.isArray(question.options) ? question.options.join(", ") : question.options}</td>
              <td>{question.correct}</td>
              <td>
                <button onClick={() => handleDelete(question.questionID)}>Delete</button>
                <button onClick={() => handleUpdate(question)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedQuestion && (
        <div>
          <h3>Edit Question</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Text:</label>
              <input type="text" name="text" value={updateData.text} onChange={handleChange} />
            </div>
            <div>
              <label>Type:</label>
              <input type="text" name="type" value={updateData.type} onChange={handleChange} />
            </div>
            <div>
              <label>Difficulty:</label>
              <input type="text" name="difficulty" value={updateData.difficulty} onChange={handleChange} />
            </div>
            <div>
              <label>Options:</label>
              <input 
                type="text" 
                name="options" 
                value={Array.isArray(updateData.options) ? updateData.options.join(", ") : updateData.options} 
                onChange={handleChange} 
                />

            </div>
            <div>
              <label>Correct:</label>
              <input type="text" name="correct" value={updateData.correct} onChange={handleChange} />
            </div>
            <div>
              <button type="submit">Update Question</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TestQuestions;
