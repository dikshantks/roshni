import React, { useState, useEffect } from "react";
import axios from "axios";

const TestView = () => {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [updateData, setUpdateData] = useState({
    subject: "",
    time: "",
    expiry: "",
    imageUrl: ""
  });
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tests");
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setError("An error occurred while fetching tests.");
    }
  };

  const handleDelete = async (testID) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tests/delete/${testID}`);
      if (response.status === 200) {
        setTests((prevTests) => prevTests.filter((test) => test.testID !== testID));
        console.log("Test deleted successfully");
      } else {
        console.error("Failed to delete test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      setError("An error occurred while deleting the test.");
    }
  };

  const handleUpdate = (test) => {
    setSelectedTest(test);
    setUpdateData({
      subject: test.subject,
      time: test.time,
      expiry: test.expiry,
      imageUrl: test.imageUrl
    });
  };

  const handleViewQuestions = (testID) => {
    // Redirect to the TestQuestions page for the selected test
    window.location.href = `/view-questions/${testID}`;
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/tests/update/${selectedTest.testID}`, updateData);
      if (response.status === 200) {
        const updatedTests = tests.map((test) => {
          if (test.testID === selectedTest.testID) {
            return {
              ...test,
              subject: updateData.subject,
              time: updateData.time,
              expiry: updateData.expiry,
              imageUrl: updateData.imageUrl
            };
          }
          return test;
        });
        setTests(updatedTests);
        setSelectedTest(null);
        console.log("Test updated successfully");
      } else {
        console.error("Failed to update test");
      }
    } catch (error) {
      console.error("Error updating test:", error);
      setError("An error occurred while updating the test.");
    }
  };

  return (
    <div>
      <h3>View Tests</h3>

      {error && <p className="error-message">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Time</th>
            <th>Expiry</th>
            <th>Image URL</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.testID}>
              <td>{test.subject}</td>
              <td>{test.time}</td>
              <td>{test.expiry}</td>
              <td>{test.imageUrl}</td>
              <td>
                <button onClick={() => handleDelete(test.testID)}>Delete</button>
                <button onClick={() => handleUpdate(test)}>Update</button>
                <button onClick={() => handleViewQuestions(test.testID)}>View Questions</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTest && (
        <div>
          <h3>Edit Test</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Subject:</label>
              <input type="text" name="subject" value={updateData.subject} onChange={handleChange} />
            </div>
            <div>
              <label>Time:</label>
              <input type="text" name="time" value={updateData.time} onChange={handleChange} />
            </div>
            <div>
              <label>Expiry:</label>
              <input type="text" name="expiry" value={updateData.expiry} onChange={handleChange} />
            </div>
            <div>
              <label>Image URL:</label>
              <input type="text" name="imageUrl" value={updateData.imageUrl} onChange={handleChange} />
            </div>
            <div>
              <button type="submit">Update Test</button>
              <button onClick={() => setSelectedTest(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {questions.length > 0 && (
        <div>
          <h3>Questions for Test: {selectedTest && selectedTest.subject}</h3>
          <ul>
            {questions.map((question, index) => (
              <li key={index}>{question.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestView;
