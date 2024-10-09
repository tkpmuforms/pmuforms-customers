import React, { useState } from "react";
import Navbar from "../../layout/public/Navbar";
import LoginPage from "./login/Login";
import SignupPage from "./signUp/SignUp";
import "./authpage.scss";
import { signInWithPopup } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../firebase/firebase";
import {
  FacebookLoginSvg,
  GoogleLoginSvg,
  LogoSvg,
} from "../../assets/svgs/AuthSvg";
import { useNavigate } from "react-router-dom";
import { createCustomer, log } from "../../firebase/firebaseServices";
import { Toast } from "../../utils/toast/Toast";

const Authpage = () => {
  const [page, setPage] = useState("login");
  const navigate = useNavigate();

  const handlePageChange = (page) => {
    setPage(page);
  };

  // Handle social login (Google, Facebook, etc.)
  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      socialSignInSuccessWithAuthResult(result);
      Toast("success", "Login successful");
      navigate("/dashboard");
    } catch (error) {
      log("Social login error", error.message);
      Toast("error", "Login failed: " + error.message);
    }
  };

  const socialSignInSuccessWithAuthResult = async (authResult) => {
    const user = authResult.user;
    const userToken = await user.getIdToken();

    try {
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.uid);
      localStorage.setItem("idToken", userToken);
      await createCustomer(user.email, user.displayName, user.uid);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during social login callback:", error);
    }
  };
  return (
    <>
      <Navbar
        CreatenewClick={() => {
          handlePageChange("signup");
        }}
      />
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
          <GoogleLoginSvg onClick={() => handleSocialLogin(googleProvider)} />
          <FacebookLoginSvg
            onClick={() => handleSocialLogin(facebookProvider)}
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

export default Authpage;
