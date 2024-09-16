import React, { useState } from "react";
import Navbar from "../../layout/Navbar";
import LoginPage from "./login/Login";
import SignupPage from "./signUp/SignUp";
import "./authpage.scss"; 
import { FacebookLoginSvg, GoogleLoginSvg, LogoSvg } from "../../assets/svgs/AuthSvg";

const Authpage = () => {
  const [page, setPage] = useState("login");

  const handlePageChange = (page) => {
    setPage(page);
  };

  // Handle social login (Google, Facebook, etc.)
  const handleSocialLogin = async (provider) => {
    // try {
    //   await signInWithPopup(auth, provider);
    //   log("User logged in with social provider successfully"); // Log user login
    //   history.push("/dashboard"); // Redirect to dashboard or desired page
    // } catch (error) {
    //   log("Social login error", error.message); // Log any errors
    //   alert("Social login failed. Please try again.");
    // }
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
        <LogoSvg/>
        </div>
        {page === "login" ? <LoginPage /> : <SignupPage />}
        <div className="switch-auth">
          {page === "login" ? (
            <p>
              Don't have an account?{" "}
              <button onClick={() => handlePageChange("signup")} className="switch-auth-button">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => handlePageChange("login")} className="switch-auth-button">
                Log in
              </button>
            </p>
          )}
        </div>
         
        <p>Or sign in with</p>
        <div className="social-signin">
     
          <GoogleLoginSvg/>
          <FacebookLoginSvg/>
         
        </div>
        <p className="terms-text">
          By proceeding, you agree to our <a href="#">Terms and conditions</a> and our <a href="#">Privacy policy</a>
        </p>
      </div>
    </>
  );
};

export default Authpage;
