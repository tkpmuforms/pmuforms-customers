import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FacebookLoginSvg,
  GoogleLoginSvg,
  LogoSvg,
} from "../../assets/svgs/AuthSvg";
import Navbar from "../../layout/public/Navbar";
import "./authpage.scss";

import { HandleSocialLogin } from "./authUtils";
import { facebookProvider, googleProvider } from "../../firebase/firebase";
import useAuth from "../../context/useAuth";
import LoginPage from "./authsubfolders/login/Login";
import SignupPage from "./authsubfolders/signUp/SignUp";

const AuthPage = () => {
  const [page, setPage] = useState("login");
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();

  const handlePageChange = (page) => setPage(page);

  return (
    <>
      <Navbar CreatenewClick={() => handlePageChange("signup")} />
      <div className="auth-container">
        <div className="auth-logo">
          <LogoSvg />
        </div>
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
              HandleSocialLogin(googleProvider, navigate, handleAuthSuccess)
            }
          />
          <FacebookLoginSvg
            onClick={() =>
              HandleSocialLogin(facebookProvider, navigate, handleAuthSuccess)
            }
          />
        </div>
        <p className="terms-text">
          By proceeding, you agree to our <a href="#">Terms and conditions</a>{" "}
          and our <a href="#">Privacy policy</a>
        </p>
      </div>
    </>
  );
};

export default AuthPage;
