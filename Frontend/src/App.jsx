// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/Admin-dashboard";
// import AdminDashboard from "../pages/Admin-dashboard.jsx";
// import Students from "./pages/Students";
// import Teachers from "./pages/Teachers";
// import Courses from "./pages/Courses";
// import Analytics from "./pages/Analytics";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}>
          {/* <Route path="students" element={<Students />} /> */}
          {/* <Route path="teachers" element={<Teachers />} /> */}
          {/* <Route path="courses" element={<Courses />} /> */}
          {/* <Route path="analytics" element={<Analytics />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
