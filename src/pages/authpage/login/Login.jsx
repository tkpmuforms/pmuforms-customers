import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // or `history` depending on your router
import "./login.scss";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useAuth } from "../../../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [forgetpassword, setForgotPassword] = useState(false);
  const { login } = useAuth();

  // Handle user login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to log in:", error);
    }
  };

  return (
    <>
      {forgetpassword === true ? (
        <ForgotPasswordForm onCancel={() => setForgotPassword(false)} />
      ) : (
        <div className="login-page">
          <div className="login-container">
            <h2>
              Sign in now to complete required forms for your next appointment
            </h2>
            <p className="subtext">
              Important: Don't wait until the day of your appointment. Some of
              this information must be filled out a few days in advance.
            </p>

            {/* Email and Password Login Form */}
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                />
              </div>

              <div className="forgot-password">
                <a onClick={() => setForgotPassword(true)}>Forgot Password?</a>
              </div>

              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
