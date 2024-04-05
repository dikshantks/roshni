import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CreateQuestions = () => {
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: '',
    difficulty: '',
    options: [],
    correct: ''
  });

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
        options: [],
        correct: ''
      });
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleDone = () => {
    window.location.href = '/createTest';
  }
  
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleAddOption = () => {
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] });
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
          {/* Add other question type options here */}
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
          {/* Add other difficulty options here */}
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
          </div>
        )}
        <label htmlFor="correct">Correct Option:</label>
        <select
          id="correct"
          value={newQuestion.correct}
          onChange={(e) => setNewQuestion({ ...newQuestion, correct: e.target.value })}
          required
        >
          <option value="">Select Correct Option</option>
          {newQuestion.options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleDone}>Done</button>
      </form>
    </div>
  );
};

export default CreateQuestions;
