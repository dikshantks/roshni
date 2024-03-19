import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CreateQuestions from './CreateQuestions';
const CreateTest = () => {
  const [subject, setSubject] = useState('');
  const [time, setTime] = useState('');
  const [expiry, setExpiry] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [createDate, setCreateDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [testID, setTestID] = useState('');
  const [testCreated, setTestCreated]=useState(false);
  const navigate = useNavigate();
  // const [addingQuestion, setAddingQuestion] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !time || !expiry) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');

    try {
      const response = await axios.post("http://localhost:5000/api/tests/create", {
        subject,
        time,
        expiry,
        imageUrl,
        createDate
      });

      if (response.data.success) {
        setError("Test Created Successfully!");
        setTestID(response.data.testID);
        setTestCreated(true);
        localStorage.setItem('testID', response.data.testID);
        // navigate(`http://localhost:5000/api/tests/${response.data.testID}/questions`);
      } else {
        setError(response.data.error || 'Test creation failed.');
      }
    } catch (error) {
      console.error('Error creating test:', error);
      setError("Error creating test: " + error.message);
    }
  };

  // const handleAddQuestion = async () => {
  //   setAddingQuestion(true); // Show the add question form
  //   if (newQuestion.text) {
  //     // Only add the question if it's not empty
  //     setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
  //   }
  // };
  // const handleQuestionSubmit = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     // Assuming you have an API endpoint to add questions and get the test ID back:
  //     const response = await axios.post(
  //       "http://localhost:5000/api/tests/create",
  //       { ...newQuestion }
  //     );
  
  //     if (response.status === 201 && response.data.testID) { // Check for successful creation (201) and testID presence
  //       const updatedQuestion = { ...newQuestion, testID: response.data.testID };
  //       setQuestions([...questions, updatedQuestion]);
  //       setNewQuestion({ text: '', type: '', difficulty: '', options: [], correct: '' });
  //       console.log('Question added successfully!');
  //     } else {
  //       console.error('Failed to add question:', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error adding question:', error);
  //   }
  // };
  
  
  return (
    <div>
      {testCreated ?(<CreateQuestions testID={testID} />) : (

      <form onSubmit={handleSubmit} method='POST'>
        <h3>Create Test</h3>
        {error && <p className="error-message">{error}</p>}
  
        <div className="mb-3">
          <label>Subject</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter subject name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
  
        <div className="mb-3">
          <label>Duration (minutes/hours)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter test duration"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
  
        <div className="mb-3">
          <label>Expiry Date/Time</label>
          <input
            type="datetime-local"
            className="form-control"
            placeholder="Enter test expiry"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
        </div>
  
        <div className="mb-3">
          <label>Image URL (optional)</label>
          <input
            type="url"
            className="form-control"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
  
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Create Test
          </button>
        </div>
      </form>         
    )}
    </div>
  );
}
export default CreateTest;