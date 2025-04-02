import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RouteWrapper from "./routes/RouteWrapper";
import useAuth from "./context/useAuth";

const AppWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const { hash } = location;

    let artistId = null;

    if (hash.startsWith("#/")) {
      artistId = hash.substring(2);
    }

    if (artistId) {
      localStorage.setItem("artistId", artistId);

      // Add this condition to redirect to dashboard when authenticated
      if (isAuthenticated && location.pathname === "/") {
        navigate("/dashboard");
      }
    }
  }, [location, isAuthenticated]);

  return (
    <>
      <RouteWrapper />
    </>
  );
};

export default AppWrapper;
