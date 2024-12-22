import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import "./signup.scss";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase/firebase";
import { createCustomer } from "../../../firebase/services";
import PersonalDetailsForm from "./PersonalDetailsForm";

const SignupPage = () => {
  const [secondPage, setSecondPage] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const handleSignup = async (values, { setSubmitting }) => {
    const { email, password } = values;
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      const artistId = localStorage.getItem("artistId");
      await createCustomer({
        accessToken: await user.getIdToken(),
        artistId: artistId,
        email: user.email,
        name: user.displayName,
      });

      setSecondPage(true);
    } catch (error) {
      alert("Signup failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>
          Sign up now to complete required forms for your next appointment
        </h2>
        <p className="subtext">
          Important: Don't wait until the day of your appointment. Some of this
          information must be filled out a few days in advance.
        </p>

        {!secondPage ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSignup}
          >
            {({ isSubmitting }) => (
              <Form className="signup-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Create Password</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter Password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="error"
                  />
                </div>

                <button
                  type="submit"
                  className="signup-button"
                  disabled={isSubmitting}
                >
                  Create Account
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <PersonalDetailsForm onSubmitClick={() => navigate("/dashboard")} />
        )}
      </div>
    </div>
  );
};

export default SignupPage;
