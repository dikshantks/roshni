import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const UpdateQuestions = ({ testID, quesID, selectedQuestion, closeModal }) => {
  const [questionData, setQuestionData] = useState({
    text: '',
    type: '',
    difficulty: '',
    options: [],
    correct: [],
    marks: 0,
    image: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Selected Question:", selectedQuestion);
    if (selectedQuestion) {
      // Set the question data to populate the form fields
      setQuestionData({
        text: selectedQuestion.text,
        type: selectedQuestion.type,
        difficulty: selectedQuestion.difficulty,
        options: selectedQuestion.options,
        correct: selectedQuestion.correct,
        marks: selectedQuestion.marks,
        image: selectedQuestion.image});
    }
  }, [selectedQuestion]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/tests/${testID}/questions/${quesID}`, {
        text: questionData.text,
        type: questionData.type,
        difficulty: questionData.difficulty,
        options: questionData.options,
        correct: questionData.correct,
        marks: parseInt(questionData.marks),
        image: questionData.image
      }
      );
      console.log('Question updated successfully:', response.data);
      setQuestionData({
        text: '',
        type: '',
        difficulty: '',
        options: [],
        correct: [],
        marks: 0,
        image: null // Reset image state
      });
      closeModal(questionData, "Question updated successfully");
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index] = value;
    setQuestionData({ ...questionData, options: updatedOptions });
  };

  const handleCorrectChangeText = (index, value) => {
    const updatedCorrect = [...questionData.correct];
    updatedCorrect[index] = value;
    setQuestionData({ ...questionData, correct: updatedCorrect });
  };

  const handleCorrectChangeMultiple = (value) => {
    // Clear existing values and set current value only
    const updatedCorrect = [value];
    setQuestionData({ ...questionData, correct: updatedCorrect });
  };
  
  const handleAddOption = () => {
    setQuestionData({ ...questionData, options: [...questionData.options, []] });
  };

  const handleAddCorrect = () => {
    setQuestionData({ ...questionData, correct: [...questionData.correct, ' '] });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setQuestionData(prevState => ({
      ...prevState,
      image: file
    }));
  };

  return (
    <div>
      <h2>Update Question</h2>
      <form onSubmit={handleQuestionSubmit}>
        <label htmlFor="text">Question Text:</label>
        <input
          type="text"
          id="text"
          value={questionData.text}
          onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
          required
        />
        <label htmlFor="type">Question Type:</label>
        <select
          id="type"
          value={questionData.type}
          onChange={(e) => setQuestionData({ ...questionData, type: e.target.value })}
          required
        >
          <option value="">Select Type</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="text">Text</option>
        </select>
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={questionData.difficulty}
          onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}
          required
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {questionData.type === 'multiple-choice' && (
          <div>
            <label>Options:</label>
            {questionData.options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddOption}>Add Option</button>
            <label htmlFor="correct">Correct Option:</label>
            <select
              id="correct"
              value={questionData.correct}
              onChange={(e) => handleCorrectChangeMultiple(e.target.value)} // Assuming only one correct option for multiple-choice
              required
            >
              <option value="">Select Correct Option</option>
              {questionData.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
        {questionData.type === 'text' && (
          <div>
            <label htmlFor="correct">Correct Options:</label>
            {questionData.correct.map((correct, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={correct}
                  onChange={(e) => handleCorrectChangeText(index, e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddCorrect}>Add Correct Option</button>
          </div>
        )}
        <label htmlFor="image">Upload Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label htmlFor="marks">Marks: </label>
        <input
          type="text"
          id="marks"
          value={questionData.marks}
          onChange={(e) => setQuestionData({ ...questionData, marks: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UpdateQuestions;
