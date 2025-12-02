import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/admin/Admin-dashboard";
import RegisterStudent from "./pages/admin/RegisterStudent";
import Home from "./pages/home/Landingpage";
import LoginPage from "./Components/Home/Login";
import StudentDashboard from "./pages/students/student-dashboard";
import TeacherDashboard from "./pages/teacher/teacher-dashboard";
import ResetPasswordPage from "./Components/Home/resetpassword";
import AdminProtectedRoute from "./pages/adminProtectedRoute";
import TeacherProtectedRoute from "./pages/teacherProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        <Route path="/admin/register-student" element={<RegisterStudent />} />

        {/* Teacher & Student dashboards (top-level) */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherProtectedRoute><TeacherDashboard /></TeacherProtectedRoute>} />
        <Route path="/reset-password/:role/:token" element={<ResetPasswordPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;


