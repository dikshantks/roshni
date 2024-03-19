import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreateQuestions = () => {
  // const { testID } = useParams();
  
  const [questions, setQuestions] = useState([]);
  const [questionID, setQuestionID] = useState('');
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: '', 
    difficulty: '',
    options: [], // Array of options for multiple choice questions
    correct: '' // Index of the correct option for multiple choice questions (or true/false answer)
  });
  const [addingQuestion, setAddingQuestion] = useState(false);

  const item = localStorage.getItem('testID');
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tests/${item}/questions`);
        setQuestions(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [item]);

  const handleAddQuestion = () => {
    setAddingQuestion(true);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
  
    axios.post(`http://localhost:5000/api/tests/${item}/questions`, { ...newQuestion, item })
      .then(response => {
        console.log('Question added successfully', response.data);
        setNewQuestion({ text: '', type: '', difficulty: '', options: [], correct: '' });
        setAddingQuestion(false); // Hide the form after submission
    })
      .catch(error => {
        console.error('Error adding question:', error);
      });
  };
  

  return (
<div>
  <h2>Add Questions for Test ID: {item}</h2>
  <button onClick={handleAddQuestion}>Add Question</button>
  {addingQuestion && (
    <form onSubmit={handleQuestionSubmit}>
      <label htmlFor="questionText">Question Text:</label>
      <textarea
        id="questionText"
        value={newQuestion.text}
        onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
        required
      />
      <label htmlFor="questionType">Question Type:</label>
      <select
        id="questionType"
        value={newQuestion.type}
        onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
        required
      >
        <option value="">Select Type</option>
        <option value="multiple-choice">Multiple Choice</option>
        {/* Add other question type options here */}
      </select>
      <label htmlFor="questionDifficulty">Difficulty:</label>
      <select
        id="questionDifficulty"
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
        <>
          <label htmlFor="options">Options:</label>
          {newQuestion.options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const options = [...newQuestion.options];
                  options[index] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: options });
                }}
                required
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] })}
          >
            Add Option
          </button>
          <label htmlFor="correctOption">Correct Option:</label>
          <select
            id="correctOption"
            value={newQuestion.correct}
            onChange={(e) => setNewQuestion({ ...newQuestion, correct: e.target.value })}
            required
          >
            <option value="">Select Correct Option</option>
            {newQuestion.options.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </select>
          </>
      )}
      <button type="submit">Submit</button>
    </form>
  )}
</div>

  );
};

export default CreateQuestions;
