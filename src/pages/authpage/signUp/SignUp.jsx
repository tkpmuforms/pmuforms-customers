import React, { useState } from "react";

import "./signup.scss"; // Import the CSS file for styling

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    // if (password !== confirmPassword) {
    //   alert("Passwords do not match. Please try again.");
    //   return;
    // }

    // try {
    //   const userCredential = await auth.createUserWithEmailAndPassword(
    //     email,
    //     password
    //   );
    //   const user = userCredential.user;
    //   await createCustomer(user.email, "New Customer", user.uid); // Create customer in Firestore
    //   await setAuthToken(); // Store token in local storage
    //   log(`User ${email} signed up successfully`); // Log user signup
    //   window.location.href = "/dashboard"; // Redirect to dashboard or desired page
    // } catch (error) {
    //   log("Signup error", error.message);
    //   alert("Signup failed. Please try again.");
    // }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Sign up now to complete required forms for your next appointment</h2>
        <p className="subtext">
          Important: Don't wait until the day of your appointment. Some of this
          information must be filled out a few days in advance.
        </p>

        <form onSubmit={handleSignup} className="signup-form">
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
            <label htmlFor="create-password">Create Password</label>
            <input
              type="password"
              id="create-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter Password"
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
