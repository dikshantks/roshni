import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Components/Login"; // Assuming the login component is in Login.jsx
import Dashboard from "./Components/Dashboard"; // Assuming the Dashboard component is in Dashboard.jsx
import AddEvaluator from "./Components/EvalAdd"; // Assuming the AddEvaluator component is in AddEvaluator.jsx
import AddFunder from "./Components/FundAdd"; // Assuming the AddFunder component is in AddFunder.jsx
import ViewEvaluator from "./Components/EvalView"; // Assuming the ViewEvaluator component is in ViewEvaluator.jsx
import ViewFunder from "./Components/FundView"; // Assuming the ViewFunder component is in ViewFunder.jsx

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-evaluator" element={<AddEvaluator />} />
        <Route path="/add-funder" element={<AddFunder />} />
        <Route path="/view-evaluators" element={<ViewEvaluator />} />
        <Route path="/view-funders" element={<ViewFunder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
