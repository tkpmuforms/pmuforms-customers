import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { LogoSvg } from "../../../assets/svgs/AuthSvg";
import {
  getAuthenticatedUser,
  SavePersonalInformation,
} from "../../../services/services";
import "./personalDetailsForm.scss";

const PersonalDetailsForm = ({ onSubmitClick }) => {
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    homeAddress: "",
    primaryPhone: "",
    referralSource: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    dob: Yup.date().required("Required").typeError("Invalid date format"),
    homeAddress: Yup.string().required("Required"),
    primaryPhone: Yup.string().required("Required"),
    referralSource: Yup.string().required("Required"),
    emergencyContactName: Yup.string().required("Required"),
    emergencyContactPhone: Yup.string().required("Required"),
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const customer = await getAuthenticatedUser();
        if (customer?.user?.info) {
          const {
            client_name = "",
            date_of_birth = "",
            home_address = "",
            cell_phone = "",
            referred = "",
            emergency_contact_name = "",
            emergency_contact_phone = "",
          } = customer.user.info;

          setInitialValues({
            firstName: client_name.split(" ")[0] || "",
            lastName: client_name.split(" ")[1] || "",
            dob: date_of_birth.split("T")[0] || "", // Extract date portion
            homeAddress: home_address || "",
            primaryPhone: cell_phone || "",
            referralSource: referred || "",
            emergencyContactName: emergency_contact_name || "",
            emergencyContactPhone: emergency_contact_phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching customer info:", error);
      }
    };

    fetchInfo();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await SavePersonalInformation(values);
      setSubmitting(false);
      onSubmitClick();
    } catch (error) {
      console.error("Error updating customer info:", error);
    }
  };

  const CustomField = ({ label, name, type, placeholder, optional }) => (
    <div className="form-group">
      <label htmlFor={name}>
        {label} {optional && <span className="optional">(Optional)</span>}
      </label>
      <Field
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="form-field"
      />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );

  return (
    <div className="personal-details-page">
      <div className="personal-details-container">
        <LogoSvg />
        <h2>We would like to know a little about you</h2>
        <p className="subtext">
          Important: Fill out this information a few days before your
          appointment.
        </p>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="personal-details-form">
              <div className="grid-container">
                <CustomField
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                />
                <CustomField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                />
              </div>

              <CustomField
                label="Date of Birth"
                name="dob"
                type="date"
                placeholder="DD/MM/YYYY"
              />
              <CustomField
                label="Home Address"
                name="homeAddress"
                type="text"
                placeholder="Enter your home address"
              />
              <CustomField
                label="Primary Phone Number"
                name="primaryPhone"
                type="tel"
                placeholder="Enter your primary phone number"
              />
              <CustomField
                label="Referral Source"
                name="referralSource"
                type="text"
                placeholder="How did you hear about us?"
              />
              <CustomField
                label="Emergency Contact Name"
                name="emergencyContactName"
                type="text"
                placeholder="Enter Emergency Contact Name"
                optional
              />
              <CustomField
                label="Emergency Contact Phone Number"
                name="emergencyContactPhone"
                type="tel"
                placeholder="Enter Contact Phone Number"
                optional
              />

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
