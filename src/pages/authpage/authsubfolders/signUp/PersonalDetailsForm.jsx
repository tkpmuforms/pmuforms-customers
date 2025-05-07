import { Avatar, CircularProgress } from "@mui/material";
import imageCompression from "browser-image-compression";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { GoBackSvg } from "../../../../assets/svgs/DashboardSvg";
import { useSnackbar } from "../../../../context/SnackbarContext";
import { storage } from "../../../../firebase/firebase";
import { setUser } from "../../../../redux/auth";
import {
  getAuthenticatedUser,
  SavePersonalInformation,
} from "../../../../services/services";
import "./personalDetailsForm.scss";

const PersonalDetailsForm = ({ onSubmitClick }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [avatarUrl, setAvatarUrl] = useState("");
  const { showAlert } = useSnackbar();
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "", // Added email field to initial values
    dob: "",
    homeAddress: "",
    primaryPhone: "",
    referralSource: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    dob: Yup.date().required("Required").typeError("Invalid date format"),
    homeAddress: Yup.string().required("Required"),
    primaryPhone: Yup.string().required("Required"),
    referralSource: Yup.string(),
    emergencyContactName: Yup.string(),
    emergencyContactPhone: Yup.string(),
    // Email is not part of validation schema as it's disabled
  });

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true); // Start loading
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
            avatar_url = "",
          } = customer.user.info;

          setInitialValues({
            firstName: client_name.split(" ")[0] || "",
            lastName: client_name.split(" ")[1] || "",
            email: user?.email || "", // Set email from user object
            dob: date_of_birth.split("T")[0] || "",
            homeAddress: home_address || "",
            primaryPhone: cell_phone || "",
            referralSource: referred || "",
            emergencyContactName: emergency_contact_name || "",
            emergencyContactPhone: emergency_contact_phone || "",
            avatarUrl: avatar_url ?? null,
          });

          setAvatarUrl(avatar_url || "");
        }
      } catch (error) {
        console.error("Error fetching customer info:", error);
        showAlert("error", "Failed to load personal details.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchInfo();
  }, [showAlert, user?.email]);

  const handleImageUpload = async (file) => {
    try {
      setUploadingAvatar(true);
      const options = {
        maxSizeMB: 0.1, // 100KB
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `dps/${file.name}-${Date.now()}`); // Create a storage reference
      const snapshot = await uploadBytes(storageRef, compressedFile); // Upload compressed file
      const downloadUrl = await getDownloadURL(snapshot.ref); // Get download URL
      setAvatarUrl(downloadUrl); // Update the avatar URL state
    } catch (error) {
      console.error("Error uploading image:", error);
      showAlert("error", "Failed to upload profile picture.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Filter out email field from values to exclude it from backend update
      const { email, ...dataToSubmit } = values;

      const data = { ...dataToSubmit, avatarUrl }; // Include avatarUrl in the form data, but exclude email
      SavePersonalInformation(data).then((res) => {
        setSubmitting(false);
        dispatch(setUser(res?.customer));
        onSubmitClick();
      });
    } catch (error) {
      console.error("Error updating customer info:", error);
      setSubmitting(false);
      showAlert("error", "Error updating personal information");
    }
  };

  const CustomField = ({
    label,
    name,
    type,
    placeholder,
    optional,
    disabled,
  }) => (
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
        disabled={disabled}
      />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );

  return (
    <div>
      <div onClick={() => onSubmitClick()} className="go-back">
        <GoBackSvg />
        <p>Go back to dashboard</p>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress size={80} sx={{ color: "#8e2d8e" }} />
        </div>
      ) : (
        <div className="personal-details-page">
          <div className="personal-details-container">
            <div className="avatar-section">
              <label
                htmlFor="avatar-upload"
                style={{ cursor: "pointer", position: "relative" }}
              >
                {uploadingAvatar ? (
                  <div
                    style={{ position: "relative", width: 100, height: 100 }}
                  >
                    <Avatar
                      src={avatarUrl || ""}
                      alt="Profile Avatar"
                      sx={{ width: 100, height: 100, opacity: 0.5 }}
                    >
                      {user?.displayName
                        ? user.displayName.slice(0, 2).toUpperCase()
                        : ""}
                    </Avatar>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress size={40} sx={{ color: "#8e2d8e" }} />
                    </div>
                  </div>
                ) : (
                  <Avatar
                    src={avatarUrl || ""}
                    alt="Profile Avatar"
                    sx={{ width: 100, height: 100 }}
                  >
                    {user?.displayName
                      ? user.displayName.slice(0, 2).toUpperCase()
                      : ""}
                  </Avatar>
                )}
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
                disabled={uploadingAvatar}
              />
            </div>
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

                  {/* Email field - disabled and styled to indicate it's not editable */}
                  <CustomField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    disabled={true}
                  />

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
                    disabled={isSubmitting || uploadingAvatar}
                  >
                    Save Personal Details
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalDetailsForm;
