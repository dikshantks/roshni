import React from "react";
import { Navigate,BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Components/Login"; // Assuming the login component is in Login.jsx
import Dashboard from "./Components/Dashboard"; // Assuming the Dashboard component is in Dashboard.jsx
import AddEvaluator from "./Components/EvalAdd"; // Assuming the AddEvaluator component is in AddEvaluator.jsx
import AddFunder from "./Components/FundAdd"; // Assuming the AddFunder component is in AddFunder.jsx
import ViewEvaluator from "./Components/EvalView"; // Assuming the ViewEvaluator component is in ViewEvaluator.jsx
import ViewFunder from "./Components/FundView"; // Assuming the ViewFunder component is in ViewFunder.jsx
import CreateQuestions from "./Components/CreateQuestions";
import UpdateQuestions from "./Components/UpdateQuestions";
import QuesView from "./Components/QuesView";
import Dash from "./Components/dash";
import Navbar from "./Components/Navbar";
import Results from "./Components/ResultsView";
function App() {
  
  return (
    <BrowserRouter>
      <React.Fragment>
        <Navbar />
      </React.Fragment>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Login /></ProtectedRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add-evaluator" element={<PrivateRoute><AddEvaluator /></PrivateRoute>} />
        <Route path="/add-funder" element={<PrivateRoute><AddFunder /></PrivateRoute>} />
        <Route path="/view-evaluators" element={<PrivateRoute><ViewEvaluator /></PrivateRoute>} />
        <Route path="/view-funders" element={<PrivateRoute><ViewFunder /></PrivateRoute>} />
        <Route path="/createQuestions" element={<PrivateRoute><CreateQuestions /></PrivateRoute>} />
        <Route path="/updateQuestions" element={<PrivateRoute><UpdateQuestions /></PrivateRoute>} />
        <Route path="/view-questions/:testID" element={<PrivateRoute><QuesView /></PrivateRoute>} />
        <Route path="/dash" element={<PrivateRoute><Dash/></PrivateRoute>} />
        <Route path="/view-results" element={<PrivateRoute><Results/></PrivateRoute>} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

export function ProtectedRoute(props) {
  const auth = JSON.parse(localStorage.getItem('accessToken'));

  if (auth) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return props.children;
  }
}

export function PrivateRoute(props) {
  const auth = JSON.parse(localStorage.getItem('accessToken'));

  if (!auth) {
    return <Navigate to="/" replace />;
  } else {
    return props.children;
  }
}