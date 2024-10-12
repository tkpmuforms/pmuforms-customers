import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { LogoSvg } from "../../../assets/svgs/AuthSvg";
import { useAuth } from "../../../context/AuthContext";
import { updateCustomerInfo } from "../../../firebase/firebaseServices";
import "./personalDetailsForm.scss"; // Import the CSS file for styling

const PersonalDetailsForm = ({ onSubmitClick }) => {
  const userId = localStorage.getItem("userId");
  const { currentUser } = useAuth();
  const initialValues = {
    firstName: "",
    lastName: "",
    date_of_birth: "",
    home_address: "",
    cell_phone: "",
    referred: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    date_of_birth: Yup.string().required("Required"),
    home_address: Yup.string().required("Required"),
    cell_phone: Yup.string().required("Required"),
    referred: Yup.string().required("Required"),
    emergency_contact_name: Yup.string().required("Required"),
    emergency_contact_phone: Yup.string().required("Required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const client_name = values.firstName + " " + values.lastName;
    values = { ...values, client_name };
    console.log("Form data:", values);
    updateCustomerInfo(userId, values, currentUser)
      .then(() => {
        setSubmitting(false);
        onSubmitClick();
      })
      .catch((error) => {
        console.error("Error updating customer info:", error);
      });
  };

  return (
    <div className="personal-details-page">
      <div className="personal-details-container">
        <LogoSvg />
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
              <div className="grid-container">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="error"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="date_of_birth">Date of Birth</label>
                <Field
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  placeholder="DD/MM/YYYY"
                  format="dd/MM/yyyy"
                />
                <ErrorMessage
                  name="date_of_birth"
                  component="div"
                  className="error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="home_address">Home Address</label>
                <Field
                  type="text"
                  id="home_address"
                  name="home_address"
                  placeholder="Enter your home address"
                />
                <ErrorMessage
                  name="home_address"
                  component="div"
                  className="error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cell_phone">Primary Phone Number</label>
                <Field
                  type="tel"
                  id="cell_phone"
                  name="cell_phone"
                  placeholder="Enter your primary phone number"
                />
                <ErrorMessage
                  name="cell_phone"
                  component="div"
                  className="error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="referred">Referral Source</label>
                <Field
                  type="text"
                  id="referred"
                  name="referred"
                  placeholder="How did you hear about us?"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_name">
                  Emergency Contact Name (Optional)
                </label>
                <Field
                  type="text"
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  placeholder="Enter Emergency Contact Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergency_contact_phone">
                  Emergency Contact Phone Number (Optional)
                </label>
                <Field
                  type="tel"
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  placeholder="Enter Contact Phone Number"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
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
