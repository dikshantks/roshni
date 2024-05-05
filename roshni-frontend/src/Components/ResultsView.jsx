import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

const ResultsView = () => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const testPin = location.state.data;
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null)

  useEffect(() => {
    const fetchResults = async () => {
        console.log(testPin);
      try {
        const response = await axios.get(`https://roshni-api.onrender.com/api/results`);
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
  const columns = [
    {
      name: "Score",
      selector: (row) => row.firstname,
      sortable: true
    },
    {
      name: "Student ID",
      selector: (row) => row.studentID,
      sortable: true
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex justify-center items-center">
          <TrashIcon className="cursor-pointer h-6 w-6" onClick={() => handleDelete(row.evalID)} />
        </div>
      )    }
  ]
  return (
    <>
    <header className="bg-white shadow">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Results</h1>
    </div>
  </header>
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
    </>
  );
};

export default ResultsView;
