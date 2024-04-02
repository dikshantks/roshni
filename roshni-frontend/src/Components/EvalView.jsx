import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewEval = () => {
  const [evaluators, setEvaluators] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvaluators();
  }, []);

  const fetchEvaluators = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/evaluators");
      setEvaluators(response.data);
    } catch (error) {
      console.error("Error fetching evaluators:", error);
      setError("An error occurred while fetching evaluators.");
    }
  };

  const handleDelete = async (evalID) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/evaluators/delete/${evalID}`);
      if (response.status === 200) {
        setEvaluators((prevEvaluators) => prevEvaluators.filter((evaluator) => evaluator.evalID !== evalID));
        console.log("Evaluator deleted successfully");
      } else {
        console.error("Failed to delete evaluator");
      }
    } catch (error) {
      console.error("Error deleting evaluator:", error);
      setError("An error occurred while deleting the evaluator.");
    }
  };

  return (
    <div>
      <h3>View Evaluators</h3>

      {error && <p className="error-message">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Date of Birth</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {evaluators.map((evaluator) => (
            <tr key={evaluator.evalID}>
              <td>{evaluator.firstname}</td>
              <td>{evaluator.lastname}</td>
              <td>{evaluator.email}</td>
              <td>{evaluator.DOB}</td>
              <td>{evaluator.loc}</td>
              <td>
                <button onClick={() => handleDelete(evaluator.evalID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEval;
