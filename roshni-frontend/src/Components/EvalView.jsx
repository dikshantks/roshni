import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import './EvalView.css';
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

  const handleBackToDashboard = () => {
    window.location.href = "/dashboard";
  };
  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstname,
      sortable: true
    },
    {
      name: "Last Name",
      selector: (row) => row.lastname,
      sortable: true
    },
    {
      name: "Email",
      selector: (row) => row.email
    },
    {
      name: "Date of Birth",
      selector: (row) => row.DOB
    },
    {
      name: "Location",
      selector: (row) => row.loc,
      sortable: true
    },
    {
      name: "Action",
      cell: (row) => <button className="buttonss" style={{ marginLeft: "10px", marginTop: "2px" }} onClick={() => handleDelete(row.evalID)}>Delete</button>
    }
  ]

  const [records, setRecords] = useState(evaluators);
  function handleFilter(e) {
    const value = e.target.value.trim(); // Trim whitespace from input value
    if (value === "") {
      setRecords(evaluators); // Set records back to original evaluators array
    } else {
      const filtered = evaluators.filter((evaluator) => {
        return evaluator.firstname.toLowerCase().includes(value.toLowerCase());
      });
      setRecords(filtered);
    }
  }
  
  useEffect(() => {
    setRecords(evaluators); // Update records whenever evaluators changes
  }, [evaluators]);

  return (
    <div className="table-container">
      <h3>View Evaluators</h3>

      {error && <p className="error-message">{error}</p>}
      <div className="text-end"><input type='text' onChange={handleFilter}/></div>
      <DataTable
        columns={columns}
        data={records}
        noHeader
        pagination
        highlightOnHover
        paginationPerPage={10}
      />

      <Link to="/add-evaluator">
        <button className="buttonss" style={{ marginLeft: "10px", marginTop: "2px" }}>Add Evaluator</button>
      </Link>
    </div>
  );
};


export default ViewEval;
