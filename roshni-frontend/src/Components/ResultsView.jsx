import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ResultsView = () => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const testPin = location.state.data;

  useEffect(() => {
    const fetchResults = async () => {
        console.log(testPin);
      try {
        const response = await axios.get("http://localhost:5000/api/results");
        const filteredResults = response.data.filter(result => result.testScores[0] === testPin);
        console.log("Filtered results:", filteredResults);
        setFilteredResults(filteredResults);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setError("Error fetching results. Please try again later.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [testPin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Results</h2>
      <table>
        <thead>
          <tr>
            <th>Test Pin</th>
            <th>Score</th>
            <th>Student ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((result, index) => (
            <tr key={index}>
              <td>{result.testScores[0]}</td>
              <td>{result.testScores[1]}</td>
              <td>{result.studentID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsView;
