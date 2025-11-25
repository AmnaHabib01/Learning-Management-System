// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/Admin-dashboard";
import RegisterStudent from "./pages/admin/RegisterStudent";
import Home from "./pages/home/Landingpage";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Parent Admin Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />}>
          {/* Nested route (IMPORTANT: remove / before register-student) */}

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
