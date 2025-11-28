import React from "react";
import { Navigate } from "react-router-dom";
import userAuth from "../store/auth/login";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role } = userAuth(); // get current state from Zustand

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Logged in but role mismatch
    return <Navigate to="/login" replace />;
  }

  return children; // Access granted
};

export default ProtectedRoute;
