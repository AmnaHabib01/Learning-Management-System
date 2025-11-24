// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/Admin-dashboard";
import RegisterStudent from "./pages/admin/RegisterStudent";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Parent Admin Layout */}
        <Route path="/admin" element={<AdminDashboard />}>
          {/* Nested route (IMPORTANT: remove / before register-student) */}

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
