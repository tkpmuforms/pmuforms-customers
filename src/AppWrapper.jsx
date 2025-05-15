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

    let businessUri = null;
    if (hash.startsWith("#/")) {
      const raw = hash.substring(2).trim();
      if (raw && raw !== "null" && raw !== "undefined") {
        businessUri = raw;
        localStorage.setItem("businessUri", businessUri);
      }
    }

    if (businessUri && isAuthenticated && location.pathname === "/") {
      navigate(`/customer/dashboard/${businessUri}`);
    }
  }, [location, isAuthenticated]);

  return <RouteWrapper />;
};

export default AppWrapper;
