import React, { useState } from "react";
import "./personalDetailsForm.scss"; // Import the CSS file for styling

const PersonalDetailsForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    homeAddress: "",
    primaryPhone: "",
    referralSource: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form Data Submitted: ", formData);
  };

  return (
    <div className="personal-details-page">
      <div className="personal-details-container">
        <h2>We would like to know a little about you</h2>
        <p className="subtext">
          Important: Don't wait until the day of your appointment. Some of this
          information must be filled out a few days in advance.
        </p>

        <form onSubmit={handleSubmit} className="personal-details-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="homeAddress">Home Address</label>
            <input
              type="text"
              id="homeAddress"
              value={formData.homeAddress}
              onChange={handleInputChange}
              placeholder="Enter your home address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="primaryPhone">Primary Phone Number</label>
            <input
              type="tel"
              id="primaryPhone"
              value={formData.primaryPhone}
              onChange={handleInputChange}
              placeholder="Enter your primary phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="referralSource">Referral Source</label>
            <input
              type="text"
              id="referralSource"
              value={formData.referralSource}
              onChange={handleInputChange}
              placeholder="How did you hear about us?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactName">Emergency Contact Name (Optional)</label>
            <input
              type="text"
              id="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleInputChange}
              placeholder="Enter Emergency Contact Name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactPhone">Emergency Contact Phone Number (Optional)</label>
            <input
              type="tel"
              id="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              onChange={handleInputChange}
              placeholder="Enter Contact Phone Number"
            />
          </div>

          <button type="submit" className="submit-button">
            Save Personal Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
