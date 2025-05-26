import React, { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthenticated, setLoading, setUser } from "../redux/auth";
import axiosInstance, { getAccessToken, isValidToken } from "./axiossetup";
import { hideLoader, showLoader } from "../utils/loader/loader";

export const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};
const AuthContext = createContext({
  method: "JWT",
});

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const handleAuthSuccess = (user, token) => {
    dispatch(setLoading(false));
    dispatch(setUser(user));
    dispatch(setAuthenticated(true));
    setAuthHeader(token);
  };

  const handleAuthFail = () => {
    dispatch(setLoading(false));
    dispatch(setAuthenticated(false));
    dispatch(setUser(null));
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token && isValidToken(token)) {
      setAuthHeader(token);
    } else {
      const rawUri = localStorage.getItem("businessUri");
      const businessUri =
        rawUri && rawUri !== "null" && rawUri !== "undefined" ? rawUri : null;

      dispatch(setLoading(false));
      dispatch(setAuthenticated(false));
      dispatch(setUser(null));

      const currentPath = window.location.pathname;
      const publicPaths = [
        "/privacy-policy",
        "/support",
        "/terms-and-agreement",
      ];

      if (publicPaths.includes(currentPath)) {
        navigate(currentPath);
      } else if (businessUri) {
        navigate(`/${businessUri}`);
      } else {
        navigate("/");
      }
    }
  }, [dispatch]);

  const logout = () => {
    setAuthHeader(null);
    dispatch(setLoading(false));
    dispatch(setAuthenticated(false));
    dispatch(setUser(null));

    const rawUri = localStorage.getItem("businessUri");
    const businessUri =
      rawUri && rawUri !== "null" && rawUri !== "undefined" ? rawUri : null;

    localStorage.clear();

    if (businessUri) {
      localStorage.setItem("businessUri", businessUri); // restore valid URI after clearing
      navigate(`/${businessUri}`);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    switch (loading) {
      case true:
        showLoader();
        break;
      default:
        hideLoader();
    }
  }, [loading]);

  const value = {
    method: "JWT",
    logout,
    handleAuthSuccess,
    handleAuthFail,
    user,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
