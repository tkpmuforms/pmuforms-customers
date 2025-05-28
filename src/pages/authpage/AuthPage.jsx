import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { GoogleLoginSvg } from "../../assets/svgs/AuthSvg";
import Navbar from "../../layout/public/Navbar";
import "./authpage.scss";
import { HandleSocialLogin } from "./authUtils";
import { googleProvider } from "../../firebase/firebase";
import useAuth from "../../context/useAuth";
import LoginPage from "./authsubfolders/login/Login";
import SignupPage from "./authsubfolders/signUp/SignUp";
import { useSnackbar } from "../../context/SnackbarContext";
import { ROUTE_PATHS } from "../../routes/routes";

const AuthPage = () => {
  const [page, setPage] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAuthSuccess, isAuthenticated } = useAuth();
  const { showAlert } = useSnackbar();

  const handlePageChange = (page) => setPage(page);

  // Business URI handling logic
  useEffect(() => {
    if (isAuthenticated) {
      const rawUri = localStorage.getItem("businessUri");
      const businessAuthUri =
        rawUri && rawUri !== "null" && rawUri !== "undefined" ? rawUri : null;
      navigate(
        ROUTE_PATHS.CUSTOMER_DASHBOARD.replace(":businessUri", businessAuthUri)
      );
      return;
    }
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const businessUri = location.pathname === "/" ? "" : pathSegments[0] || "";
    if (location.pathname === "/") {
      localStorage.removeItem("businessUri");
      return;
    }
    if (businessUri) {
      localStorage.setItem("businessUri", businessUri);
      if (location.pathname !== `/${businessUri}`) {
        navigate(`/${businessUri}`);
      }
    } else {
      navigate("/");
    }
  }, [location, isAuthenticated]);

  return (
    <>
      <Navbar CreatenewClick={() => handlePageChange("signup")} />
      <div className="auth-container">
        {page === "login" ? (
          <LoginPage />
        ) : (
          <SignupPage handlePageChange={handlePageChange} />
        )}
        <div className="switch-auth">
          {page === "login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => handlePageChange("signup")}
                className="switch-auth-button"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => handlePageChange("login")}
                className="switch-auth-button"
              >
                Log in
              </button>
            </p>
          )}
        </div>
        <p>Or sign in with</p>
        <div className="social-signin">
          <GoogleLoginSvg
            onClick={() =>
              HandleSocialLogin(
                googleProvider,
                navigate,
                handleAuthSuccess,
                showAlert
              )
            }
          />
        </div>
        <p className="terms-text">
          By proceeding, you agree to our{" "}
          <Link to="/terms-and-agreement">Terms and conditions</Link> {"   "}and
          our <Link to="/privacy-policy">Privacy policy</Link>
        </p>
      </div>
    </>
  );
};

export default AuthPage;
