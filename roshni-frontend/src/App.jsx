import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login"; // Adjust path if needed

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/api/admin/login" element={<Login />} /> {/* Login route at root */}
        {/* Add additional routes for other components here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
