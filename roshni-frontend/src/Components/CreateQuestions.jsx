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
    marks: 0,
    image: null
  });
  const navigate = useNavigate();

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://roshni-api.onrender.com/api/tests/${testID}/questions`, {
        text: newQuestion.text,
        type: newQuestion.type,
        difficulty: newQuestion.difficulty,
        options: newQuestion.options,
        correct: newQuestion.correct,
        marks: parseInt(newQuestion.marks),
        image: newQuestion.image
      }
      );
      console.log('Question added successfully:', response.data);
      setNewQuestion({
        text: '',
        type: '',
        difficulty: '',
        options: [],
        correct: '',
        marks: 0,
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
  <>  
  <div>
    <form onSubmit={handleQuestionSubmit}>
    <div className="sm:col-span-4">
        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
         Question Text
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              id="text"
              value={newQuestion.text}
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="text"
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              required
                  />
          </div>
        </div>
      </div>
      <div className="sm:col-span-3">
            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
              Type
            </label>
            <div className="mt-2">
            <select
                id="type"
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                required
              >
                <option value="">Select Type</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="text">Text</option>
              </select>
            </div>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="difficulty" className="block text-sm font-medium leading-6 text-gray-900">
              Difficulty
            </label>
            <div className="mt-2">
            <select
                id="difficulty"
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                required
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div> 

      {newQuestion.type === 'multiple-choice' && (
        <div>
          <label>Options:</label>
          {newQuestion.options.map((option, index) => (
            <div key={index}>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddOption}
           className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Option</button>
            <div className="sm:col-span-3">
          <label htmlFor="correct">Correct Option:</label>
          <select
            id="correct"
            value={newQuestion.correct}
            onChange={(e) => handleCorrectChange(0, e.target.value)} // Assuming only one correct option for multiple-choice
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            required
          >
            <option value="">Select Correct Option</option>
            {newQuestion.options.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>
        </div>
      )}
    {newQuestion.type === 'text' && (
        <div>
          <label htmlFor="correct">Correct Options:</label>
          {newQuestion.correct.map((correct, index) => (
            <div key={index}>
              <input
                type="text"
                value={correct}
                onChange={(e) => handleCorrectChange(index, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm"
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddCorrect} 
          className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Add Correct Option </button>
        </div>
      )}     
         <div className="col-span-full">
            <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
              Upload Image (If any)
            </label>
            <div className="mt-2 flex items-center gap-x-3">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              />

            </div>
          </div>

      <div className="sm:col-span-4">
        <label htmlFor="marks" className="block text-sm font-medium leading-6 text-gray-900">
         Marks
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="number"
              id="marks"
              value={newQuestion.marks}
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              onChange={(e) => setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })}
              required
                  />
          </div>
        </div>
      </div>
      <button type="submit" className="flex items-center justify-center px-3 py-2 md:px-4 md:py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 md:text-lg">Submit</button>
    </form>
  </div>
  </>
);

};

export default CreateQuestions;