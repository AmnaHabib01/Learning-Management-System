import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../store/axiosInstance";

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Refresh access token first (if expired)
        await api.get("/admin/access-token");

        // Then get profile
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

export default AdminProtectedRoute;
