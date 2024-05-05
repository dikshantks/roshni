import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

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
  const [open, setOpen] = useState(false);
  const  cancelButtonRef = useRef(null)

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
      const response = await axios.put(`https://roshni-api.onrender.com/api/tests/${testID}/questions/${quesID}`, {
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
      setOpen(true);
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
          value={questionData.text}
          onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
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
          value={questionData.type}
          onChange={(e) => setQuestionData({ ...questionData, type: e.target.value })}
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
          value={questionData.difficulty}
          onChange={(e) => setQuestionData({ ...questionData, difficulty: e.target.value })}
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

        {questionData.type === 'multiple-choice' && (
          <div>
            <label>Options:</label>
            {questionData.options.map((option, index) => (
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
              value={questionData.correct}
              onChange={(e) => handleCorrectChangeMultiple(e.target.value)} // Assuming only one correct option for multiple-choice
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              required
            >
              <option value="">Select Correct Option</option>
              {questionData.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            </div>
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm"
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddCorrect}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Correct Option</button>
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
          type="text"
          id="marks"
          value={questionData.marks}
          onChange={(e) => setQuestionData({ ...questionData, marks: e.target.value })}
          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
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

export default UpdateQuestions;
