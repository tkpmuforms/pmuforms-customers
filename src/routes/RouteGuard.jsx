import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("RequireAuth currentUser:", currentUser);
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
