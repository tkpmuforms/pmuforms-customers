import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLoginSvg } from "../../assets/svgs/AuthSvg";
import Navbar from "../../layout/public/Navbar";
import "./authpage.scss";
import { HandleSocialLogin } from "./authUtils";
import { googleProvider } from "../../firebase/firebase";
import useAuth from "../../context/useAuth";
import LoginPage from "./authsubfolders/login/Login";
import SignupPage from "./authsubfolders/signUp/SignUp";
import { useSnackbar } from "../../context/SnackbarContext";

const AuthPage = () => {
  const [page, setPage] = useState("login");
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();
  const { showAlert } = useSnackbar();

  const handlePageChange = (page) => setPage(page);

  return (
    <>
      <Navbar CreatenewClick={() => handlePageChange("signup")} />
      <div className="auth-container">
        {page === "login" ? <LoginPage /> : <SignupPage />}
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
          By proceeding, you agree to our <a href="#">Terms and conditions</a>{" "}
          and our <Link to="/privacy-policy">Privacy policy</Link>
        </p>
      </div>
    </>
  );
};

export default AuthPage;
