import React, { useState } from "react";
import "./forgotPasswordForm.scss"; // Import the CSS file for styling

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Reset link sent to: ", email);
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <p className="subtext">
          Provide us with your registered email so we can send you reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter registered email address"
              required
            />
          </div>

          <button type="submit" className="reset-button">
            Send Reset Link
          </button>
        </form>

        <div className="terms-text">
          By proceeding, you agree to our <a href="#">Terms and conditions</a> and our <a href="#">Privacy policy</a>.
        </div>
      </div>

      <footer className="footer">
        <p>Powered by PMU Forms</p>
      </footer>
    </div>
  );
};

export default ForgotPasswordForm;
