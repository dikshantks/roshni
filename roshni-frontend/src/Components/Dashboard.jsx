import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h3>Welcome to Dashboard</h3>
      <div>
        <Link to="/add-evaluator">
          <button>Add Evaluator</button>
        </Link>
        <Link to="/add-funder">
          <button>Add Funder</button>
        </Link>
        <Link to="/view-evaluators"> 
          <button>View Evaluators</button>
        </Link>
        <Link to="/view-funders"> 
          <button>View Funders</button>
        </Link>
        <Link to="/createTest">
          <button>Create Test</button>
        </Link>
        <Link to="/view-tests">
          <button>View Tests</button>
        </Link>

      </div>
    </div>
  );
};

export default Dashboard;
