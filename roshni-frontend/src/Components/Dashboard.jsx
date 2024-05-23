import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Example() {
  const [tests, setTests] = useState([]);
  const [testInfo, setTestInfo] = useState([]);
  const [selectedTestID, setSelectedTestID] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);
  const fetchStudentDetails = async (studentIDs) => {
    try {
      const response = await axios.get("https://roshni-api.onrender.com/api/students", {
        params: {
          studentIDs: studentIDs.join(",")
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching student details:", error);
      return [];
    }
  };
  const fetchTests = async () => {
    try {
      const response = await axios.get("https://roshni-api.onrender.com/api/tests");
      setTests(response.data);
      const testInfoData = response.data.map((test) => ({
        testID: test.testID,
        subject: test.subject,
      }));
      setTestInfo(testInfoData);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setError("An error occurred while fetching tests.");
    }
  };

  const onClickTestSubject = (testID, subject) => {
    setSelectedTestID(testID);
    setSelectedSubject(subject);
    getResults(testID, subject);
  };
  const getResults = async (testID, subject) => {
    try {
      const response = await axios.get("https://roshni-api.onrender.com/api/results", {
        params: {
          testID: testID,
          subject: subject
        }
      });
  
      const filteredResults = response.data.filter(result => result.testID === testID);
  
      if (filteredResults.length === 0) {
        setResults([]);
        console.log("No results to display");
        return [];
      }
  
      setResults(filteredResults);
  
      // Extract student IDs from results
      const studentIDs = filteredResults.map(result => Object.keys(result.testScores)).flat();
  
      // Fetch student details
      const studentDetails = await fetchStudentDetails(studentIDs);
      console.log("Student details:", studentDetails);
  
      // Combine student details with results
      const resultsWithStudentInfo = [];
  
      for (const result of filteredResults) {
        for (const [studentID, score] of Object.entries(result.testScores)) {
          const studentInfo = studentDetails.find(info => info.pin === studentID);
          if (studentInfo) {
            resultsWithStudentInfo.push({
              studentID,
              firstName: studentInfo.firstName,
              lastName: studentInfo.lastName,
              gender: studentInfo.gender,
              location: studentInfo.location,
              score
            });
          } else {
            console.error(`Student info not found for studentID ${studentID}`);
          }
        }
      }
  
      console.log("Results with student info:", resultsWithStudentInfo);
      // Set the combined results with student info to state for rendering
      setResults(resultsWithStudentInfo);
      return resultsWithStudentInfo;
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("An error occurred while fetching results.");
      return [];
    }
  };
  
  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <div className="flex h-screen bg-gray-100">
        <div className="flex">
          <div className="hidden md:flex flex-col w-64 bg-gray-800">
            <div className="flex items-center justify-center h-16 bg-gray-900">
              <span className="text-white font-bold uppercase">Results</span>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex-1 px-2 py-4 bg-gray-800">
                <ul>
                  {testInfo.map((test, index) => (
                    <li key={index} className="mb-2">
                      <button
                        onClick={() => onClickTestSubject(test.testID, test.subject)}
                        className={`flex items-center px-4 py-2 text-white hover:bg-gray-700 ${
                          selectedTestID === test.testID && selectedSubject === test.subject ? 'bg-gray-700' : ''
                        }`}
                      >
                        {test.subject}
                        
                      </button>
                    </li>

                ))}
                </ul>
              </nav>
            </div>
          </div>
          <div className="flex-1">
            <div>
              {results.length === 0 ? (
                <p>No results to display.</p>
              ) : (
                <div>
                  <h2 className="size-text-lg font-semibold mb-4 text-center px-4 py-8">Results for {selectedSubject}</h2>
                  <table className="table table-bordered table-striped">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100">
                          Student ID
                        </th>
                        <th scope="col" className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100">
                          Name
                        </th>
                        <th scope="col" className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100">
                          Gender
                        </th>
                        <th scope="col" className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100">
                          Score
                        </th>
                        <th scope="col" className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-100">
                          Location
                        </th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <div>{result.studentID}</div>
                          </td>
                          <td className="px-4 py-2">
                            <div>
                              {result.firstName} {result.lastName}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div>{result.gender}</div>
                          </td>
                          <td className="px-4 py-2">
                            <div>{result.score}</div>
                          </td>
                          <td className="px-4 py-2">
                            <div>{result.location}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}