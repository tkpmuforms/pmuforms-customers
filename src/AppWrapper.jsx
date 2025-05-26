import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RouteWrapper from "./routes/RouteWrapper";
import useAuth from "./context/useAuth";

const AppWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Define static routes that should NOT be treated as business URIs
  const STATIC_ROUTES = [
    "privacy-policy",
    "support",
    "terms-and-agreement",
    "login",
    "signup",
    "forgot-password",
    "reset-password",
    "customer",
  ];

  useEffect(() => {
    const { pathname } = location;

    // Extract first path segment
    const pathSegments = pathname.split("/").filter(Boolean);
    const firstSegment = pathSegments[0];

    // Only treat as business URI if it's NOT a static route
    let businessUri = null;
    if (
      firstSegment &&
      firstSegment !== "null" &&
      firstSegment !== "undefined" &&
      !STATIC_ROUTES.includes(firstSegment)
    ) {
      businessUri = firstSegment;
      localStorage.setItem("businessUri", businessUri);
    }

    // Handle authenticated user navigation (only for actual business URIs)
    if (businessUri && isAuthenticated && pathname === `/${businessUri}`) {
      navigate(`/${businessUri}/customer/dashboard`);
    }
  }, [location, isAuthenticated, navigate]);

  return <RouteWrapper />;
};

export default AppWrapper;
