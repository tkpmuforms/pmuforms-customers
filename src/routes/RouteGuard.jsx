import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();
  let location = useLocation();

  if (!currentUser) {
    // Redirect them to the login page, and pass the current location
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
