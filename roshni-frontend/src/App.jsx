import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"; // Assuming the login component is in Login.jsx
import Dashboard from "./Components/Dashboard"; // Assuming the Dashboard component is in Dashboard.jsx
import AddEvaluator from "./Components/EvalAdd"; // Assuming the AddEvaluator component is in AddEvaluator.jsx
import AddFunder from "./Components/FundAdd"; // Assuming the AddFunder component is in AddFunder.jsx
// import SeeData from "./Components/SeeData"; // Assuming the SeeData component is in SeeData.jsx

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-evaluator" element={<AddEvaluator />} />
        <Route path="/add-funder" element={<AddFunder />} />
        {/* <Route path="/see-data" element={<SeeData />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
