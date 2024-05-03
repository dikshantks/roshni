import React, { useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

const CreateQuestions = ({ testID, closeModal }) => {
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: '',
    difficulty: '',
    options: [],
    correct: [],
    marks: '',
    image: null
  });
  const navigate = useNavigate();

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('text', newQuestion.text);
      formData.append('type', newQuestion.type);
      formData.append('difficulty', newQuestion.difficulty);
      formData.append('options', JSON.stringify(newQuestion.options));
      formData.append('correct',JSON.stringify(newQuestion.correct));
      formData.append('marks', newQuestion.marks);
      formData.append('image', newQuestion.image); // Append image to FormData
      console.log(testID)
      const response = await axios.post(`http://localhost:5000/api/tests/${testID}/questions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Question added successfully:', response.data);
      setNewQuestion({
        text: '',
        type: '',
        difficulty: '',
        options: [],
        correct: '',
        marks: '',
        image: null // Reset image state
      });
      closeModal(newQuestion, "Question added successfully");      // Reset form fields after successful submission
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };
  
  const handleCorrectChange = (index, value) => {
    const updatedCorrect = [...newQuestion.correct];
    updatedCorrect[index] = value;
    setNewQuestion({ ...newQuestion, correct: updatedCorrect });
  };
  
  const handleAddOption = () => {
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ' '] });
  };
  
  const handleAddCorrect = () => {
    setNewQuestion({ ...newQuestion, correct: [...newQuestion.correct, ' '] });
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewQuestion(prevState => ({
      ...prevState,
      image: file
    }));
  };

  return (
    <div>
      <h2>Add Question</h2>
      <form onSubmit={handleQuestionSubmit}>
        <label htmlFor="text">Question Text:</label>
        <input
          type="text"
          id="text"
          value={newQuestion.text}
          onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
          required
        />
        <label htmlFor="type">Question Type:</label>
        <select
          id="type"
          value={newQuestion.type}
          onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
          required
        >
          <option value="">Select Type</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="text">Text</option>
        </select>
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={newQuestion.difficulty}
          onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
          required
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        {newQuestion.type === 'multiple-choice' && (
          <div>
            <label>Options:</label>
            {newQuestion.options.map((option, index) => (
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
              value={newQuestion.correct}
              onChange={(e) => handleCorrectChange(0, e.target.value)} // Assuming only one correct option for multiple-choice
              required
            >
              <option value="">Select Correct Option</option>
              {newQuestion.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
{newQuestion.type === 'text' && (
          <div>
            <label htmlFor="options">Options:</label>
            {newQuestion.options.map((option, index) => (
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
            <label htmlFor="correct">Correct Options:</label>
            {newQuestion.correct.map((correct, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={correct}
                  onChange={(e) => handleCorrectChange(index, e.target.value)}
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
          required
        />
        <label htmlFor="text">Marks: </label>
        <input
          type="text"
          id="text"
          value={newQuestion.marks}
          onChange={(e) => setNewQuestion({ ...newQuestion, marks: e.target.value })}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateQuestions;
