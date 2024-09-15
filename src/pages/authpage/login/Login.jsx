import React, { useState } from "react";
import "./login.scss";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  // Handle user login with email and password
  const handleLogin = async (e) => {
    // e.preventDefault();
    // try {
    //   await signInWithEmailAndPassword(auth, email, password);
    //   log(`User ${email} logged in successfully`); // Log user login
    //   history.push("/dashboard"); // Redirect to dashboard or desired page
    // } catch (error) {
    //   log("Login error", error.message); // Log any errors
    //   alert("Login failed. Please check your credentials and try again.");
    // }
  };


  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Sign in now to complete required forms for your next appointment</h2>
        <p className="subtext">
          Important: Don't wait until the day of your appointment. Some of this
          information must be filled out a few days in advance.
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
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

  
    
      </div>
    </div>
  );
};

export default LoginPage;
