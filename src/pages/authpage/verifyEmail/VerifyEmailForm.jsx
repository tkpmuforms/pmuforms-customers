import React, { useState } from "react";
import "./verifyEmailForm.scss"; // Import the CSS file for styling

const VerifyEmailForm = () => {
  const [code, setCode] = useState(new Array(6).fill("")); // State for 6-digit code
  const [timeLeft, setTimeLeft] = useState(12); // Timer for resending code

  // Handle input change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return; // Ensure input is a number

    setCode([...code.map((d, idx) => (idx === index ? element.value : d))]);

    // Move to next input if number is entered
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle verification logic here
    console.log("Verification code entered: ", code.join(""));
  };

  // Handle resend code logic
  const handleResendCode = () => {
    setTimeLeft(12); // Reset timer
    // Handle code resend logic here
    console.log("Resend verification code");
  };

  // Timer for Resend Code button
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        <h2>Verify your email address</h2>
        <p className="subtext">
          Enter the 6-digit code that was sent to <strong>example@mail.com</strong>
        </p>

        <form onSubmit={handleSubmit} className="verify-email-form">
          <div className="code-inputs">
            {code.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                required
              />
            ))}
          </div>

          <button
            type="button"
            className="resend-button"
            onClick={handleResendCode}
            disabled={timeLeft > 0}
          >
            Resend Code {timeLeft > 0 ? `${timeLeft}s` : ""}
          </button>

          <button type="submit" className="continue-button">
            Continue
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

export default VerifyEmailForm;
