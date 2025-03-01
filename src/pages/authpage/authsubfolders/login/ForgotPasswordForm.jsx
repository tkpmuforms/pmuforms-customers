import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./forgotPasswordForm.scss"; // Import the CSS file for styling

const ForgotPasswordForm = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const auth = getAuth(); // Get Firebase Auth instance

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      alert(`Reset link sent to: ${email}`);
      onCancel(); // Call the callback to switch back to the login form
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      alert("Failed to send reset link. Please try again.");
    }
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

          <div className="switch-auth">
            <button
              onClick={onCancel}
              className="switch-auth-button"
            >
              Back to Login
            </button>
          </div>
          <button type="submit" className="reset-button">
            Send Reset Link
          </button>
        </form>
       

        <div className="terms-text">
          By proceeding, you agree to our <a href="/">Terms and conditions</a> and our <a href="/">Privacy policy</a>.
        </div>

     
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
