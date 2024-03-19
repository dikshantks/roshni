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
        <Link to="/see-data">
          <button>See Data</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
