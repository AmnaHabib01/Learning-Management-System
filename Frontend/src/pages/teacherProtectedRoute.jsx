import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../store/axiosInstance";

const TeacherProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Refresh access token or verify teacher role
        await api.get("/teacher/access-token");

        // If successful, set authenticated
        setIsAuth(true);
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default TeacherProtectedRoute;
