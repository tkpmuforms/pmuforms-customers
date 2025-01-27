import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import RouteWrapper from "./routes/RouteWrapper";

const AppWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    const { hash } = location;

    let artistId = null;

    // Extract artistId from hash (e.g., "#/artistId")
    if (hash.startsWith("#/")) {
      artistId = hash.substring(2); // Remove "#/"
    }

    // Store artistId in localStorage if found
    if (artistId) {
      
      localStorage.setItem("artistId", artistId);
    }
  }, [location]);
  return (
    <>
      <RouteWrapper />
    </>
  );
};

export default AppWrapper;
