import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./personalDetailsForm.scss"; // Import the CSS file for styling

const PersonalDetailsForm = ({ onSubmitClick }) => {
  const initialValues = {
    firstName: "",
    lastName: "",
    dob: "",
    homeAddress: "",
    primaryPhone: "",
    referralSource: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    dob: Yup.string().required("Required"),
    homeAddress: Yup.string().required("Required"),
    primaryPhone: Yup.string().required("Required"),
    referralSource: Yup.string(),
    emergencyContactName: Yup.string(),
    emergencyContactPhone: Yup.string(),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    console.log("Form Data Submitted: ", values);
    setSubmitting(false);
    onSubmitClick(); // Handle what happens when the form is submitted successfully
  };

  return (
    <div className="personal-details-page">
      <div className="personal-details-container">
        <h2>We would like to know a little about you</h2>
        <p className="subtext">
          Important: Don't wait until the day of your appointment. Some of this
          information must be filled out a few days in advance.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="personal-details-form">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <Field type="text" id="firstName" name="firstName" placeholder="Enter your first name" />
                <ErrorMessage name="firstName" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <Field type="text" id="lastName" name="lastName" placeholder="Enter your last name" />
                <ErrorMessage name="lastName" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <Field type="date" id="dob" name="dob" placeholder="DD/MM/YYYY" />
                <ErrorMessage name="dob" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="homeAddress">Home Address</label>
                <Field type="text" id="homeAddress" name="homeAddress" placeholder="Enter your home address" />
                <ErrorMessage name="homeAddress" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="primaryPhone">Primary Phone Number</label>
                <Field type="tel" id="primaryPhone" name="primaryPhone" placeholder="Enter your primary phone number" />
                <ErrorMessage name="primaryPhone" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="referralSource">Referral Source</label>
                <Field type="text" id="referralSource" name="referralSource" placeholder="How did you hear about us?" />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContactName">Emergency Contact Name (Optional)</label>
                <Field
                  type="text"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  placeholder="Enter Emergency Contact Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContactPhone">Emergency Contact Phone Number (Optional)</label>
                <Field
                  type="tel"
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  placeholder="Enter Contact Phone Number"
                />
              </div>

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                Save Personal Details
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
