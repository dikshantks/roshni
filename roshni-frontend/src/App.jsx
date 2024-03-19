import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"; // Adjust path if needed
import CreateTest from "./Components/CreateTest"; 
import CreateQuestions from "./Components/CreateQuestions";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/api/admin/login" element={<Login />} /> {/* Login route at root */}
        <Route path="/createTest" element={<CreateTest />} /> 
        <Route path="/createQuestions" element={<CreateQuestions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
