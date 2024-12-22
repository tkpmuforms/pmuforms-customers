import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FacebookLoginSvg,
  GoogleLoginSvg,
  LogoSvg,
} from "../../assets/svgs/AuthSvg";
import { facebookProvider, googleProvider } from "../../firebase/firebase";
import Navbar from "../../layout/public/Navbar";
import "./authpage.scss";
import LoginPage from "./login/Login";
import SignupPage from "./signUp/SignUp";
import { handleSocialLogin } from "./authUtils";

const AuthPage = () => {
  const [page, setPage] = useState("login");
  const navigate = useNavigate();

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
            onClick={() => handleSocialLogin(googleProvider, navigate)}
          />
          <FacebookLoginSvg
            onClick={() => handleSocialLogin(facebookProvider, navigate)}
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
