// src/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingSpinner from "../components/LoadingSpinner"; 

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); 
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }} 
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;