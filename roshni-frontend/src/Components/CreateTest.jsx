import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import CreateQuestions from './CreateQuestions';

const showAllTests = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/tests/");
    const tests = response.data; // Assuming the response contains an array of tests

    // Get the container element where you want to display the tests:
    const testListElement = document.getElementById('test-list'); // Replace with your actual ID

    // Clear any existing content:
    testListElement.innerHTML = ''; // Optional if needed

    // Create the HTML table structure:
    const table = document.createElement('table');
    table.classList.add('tests-table'); // Add a CSS class for styling (optional)

    // Create table header row:
    const tableHeaderRow = document.createElement('tr');
    tableHeaderRow.innerHTML = `<th>ID</th><th>Name</th><th>Description</th>`;
    table.appendChild(tableHeaderRow);

    // Loop through the tests and create table rows:
    tests.forEach((test) => {
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `<td>${test.id}</td><td>${test.name}</td><td>${test.description}</td>`; // Adjust column names based on your data
      table.appendChild(tableRow);
    });

    // Append the table to the container element:
    testListElement.appendChild(table);
  } catch (error) {
    console.error("Error fetching tests:", error);
  }
};

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