import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createFilledForm,
  getAllFilledFormsForAppointment,
  getFormsForAppointMentById,
} from "../../services/services";
import { GoBackSvg } from "../../assets/svgs/DashboardSvg";
import "./dynamicForms.scss";
import { Toast } from "../../utils/toast/Toast";
import useAuth from "../../context/useAuth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { storage } from "../../firebase/firebase";
import dayjs from "dayjs";

const FormInputTypes = {
  TEXT: "text",
  CHECKBOX: "checkbox",
  IMAGE: "image",
  DATE: "date",
  TEXTFIELD: "textfield",
  NUMBER: "numberOfField",
};
//calcualte age from date of birth
const fieldToUserInfoMapping = {
  client_name: ["client_name"],
  signature: ["client_name"],
  date_of_birth: ["date_of_birth"],
  home_address: ["home_address"],
  emergency_contact_name: ["emergency_contact_name"],
  emergency_contact_phone: ["emergency_contact_phone"],
  home_phone: ["cell_phone"],
};

const DynamicForms = () => {
  const { appointmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const businessName = localStorage.getItem("businessName");
  const [forms, setForms] = useState([]);
  const [filledForms, setFilledForms] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [formResponse, setFormResponse] = useState({});
  const [saving, setSaving] = useState(false);
  const [requiredFieldsOnSubmit, setRequiredFieldsOnSubmit] = useState([]);
  const [autofilledFields, setAutofilledFields] = useState(new Set());

  useEffect(() => {
    const fetchFilledForms = async () => {
      try {
        const fetchedFilledForms = await getAllFilledFormsForAppointment(
          appointmentId
        );
        setFilledForms(fetchedFilledForms?.filledForms || []);
      } catch (error) {
        console.error("Error fetching filled forms:", error);
      }
    };

    const fetchForms = async () => {
      try {
        const fetchedForms = await getFormsForAppointMentById(appointmentId);

        const updatedForms = fetchedForms?.forms?.map((form) =>
          JSON.parse(
            JSON.stringify(form).replace(
              /{{user\.businessName}}/g,
              businessName
            )
          )
        );

        setForms(updatedForms || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
    fetchFilledForms();
  }, [appointmentId, businessName]);

  useEffect(() => {
    if (!forms.length) return;

    const currentForm = forms[currentTab];
    if (!currentForm) return;

    const filledForm = filledForms.find(
      (f) => f?.formTemplateId === currentForm.id
    );

    if (filledForm) {
      // Populate form with saved data
      setFormResponse(filledForm?.data || {});
    } else if (
      currentForm?.sections.some((section) => section.isClientInformation)
    ) {
      // Autofill for new forms with `isClientInformation` flag
      const autofillResponse = {};
      const autofilledFieldIds = new Set();

      currentForm?.sections.forEach((section) => {
        if (section.isClientInformation) {
          section.data.forEach((field) => {
            const userInfoKeys = fieldToUserInfoMapping[field.id];
            if (userInfoKeys) {
              userInfoKeys.forEach((key) => {
                if (user?.info?.[key]) {
                  let value = user.info[key];
                  if (field.id === "date_of_birth") {
                    value = dayjs(value).format("MM-DD-YYYY");
                  }

                  autofillResponse[field.id] = value;
                  autofilledFieldIds.add(field.id);
                }
              });
            }
          });
        }
      });

      setFormResponse(autofillResponse);
      setAutofilledFields(autofilledFieldIds);
    }
  }, [forms, filledForms, currentTab, user]);

  const handleInputChange = (fieldId, value) => {
    setFormResponse((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleImageChange = async (fieldId, file) => {
    if (!file) return;

    const options = {
      maxSizeMB: 0.4, // 400KB
      maxWidthOrHeight: 500,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);

    try {
      const storageRef = ref(storage, `images/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setFormResponse((prev) => ({
        ...prev,
        [fieldId]: downloadUrl,
      }));

      Toast("success", "Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      Toast("error", "Failed to upload image.");
    }
  };

  const renderFormFields = (fields) =>
    fields.map((field) => {
      if (!field || !field.id) return null;
      const fieldValue = formResponse[field?.id] || "";
      const isRequired = field.required;
      const isFieldInvalid =
        !fieldValue && requiredFieldsOnSubmit.includes(field.id);
      const isAutofilled = autofilledFields.has(field.id);

      const fieldClass =
        field.line === "full"
          ? "form-field full-width"
          : "form-field half-width";

      const commonProps = {
        className: isFieldInvalid ? "invalid-field" : "",
        onChange: (e) => handleInputChange(field.id, e.target.value),
        required: isRequired,
        readOnly: isAutofilled,
      };

      if (!field.type) {
        return (
          <div key={field.id} className="read-only-field">
            <label>{field.title}</label>
          </div>
        );
      }

      switch (field.type) {
        case FormInputTypes.CHECKBOX:
          return (
            <div className="checkbox-group" key={field.id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!fieldValue}
                  onChange={(e) =>
                    handleInputChange(field.id, e.target.checked)
                  }
                  disabled={isAutofilled}
                />
                {field.title}
                {isRequired && <span className="required-star">*</span>}
              </label>
            </div>
          );
        case FormInputTypes.DATE:
          if (field.id === "date_of_signing") {
            const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
            return (
              <div key={field.id}>
                <label>
                  {field.title}
                  {isRequired && <span className="required-star">*</span>}
                  <input
                    type="date"
                    min={today}
                    max={today}
                    onChange={(e) =>
                      handleInputChange(field.id, e.target.value)
                    }
                  />
                </label>
              </div>
            );
          }
          return (
            <div key={field.id}>
              <label>
                {field.title}
                {isRequired && <span className="required-star">*</span>}
                <input type="date" value={fieldValue} {...commonProps} />
              </label>
            </div>
          );
        case FormInputTypes.IMAGE:
          return (
            <div key={field.id}>
              <label>
                {field.title}
                {isRequired && <span className="required-star">*</span>}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(field.id, e.target.files[0])
                  }
                />
              </label>
              {fieldValue && (
                <div className="image-preview">
                  <img
                    src={fieldValue}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "150px",
                      objectFit: "contain",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}
            </div>
          );
        case FormInputTypes.NUMBER:
          return (
            <div key={field.id}>
              <label>
                {field.title}
                {isRequired && <span className="required-star">*</span>}
                <input
                  type="number"
                  value={fieldValue}
                  {...commonProps}
                  disabled={isAutofilled}
                />
              </label>
            </div>
          );
        default:
          return (
            <div key={field.id}>
              <label>
                {field.title}
                {isRequired && <span className="required-star">*</span>}
                <input
                  type="text"
                  value={fieldValue}
                  {...commonProps}
                  disabled={isAutofilled}
                />
              </label>
            </div>
          );
      }
    });

  const handleSubmit = async () => {
    const currentForm = forms[currentTab];
    if (!currentForm) return;

    const requiredFields = currentForm.sections.flatMap(
      (section) => section.data?.filter((field) => field.required) || []
    );

    const missingFields = requiredFields.filter(
      (field) => !formResponse[field?.id]
    );

    setRequiredFieldsOnSubmit(missingFields.map((field) => field.id));

    if (missingFields.length > 0) {
      Toast("error", "Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      await createFilledForm({
        appointmentId,
        formTemplateId: currentForm.id,
        data: formResponse,
      });
      setFormResponse({});
      setSaving(false);
      // Toast("success", "Form submitted successfully");
      if (currentTab < forms.length - 1) {
        setCurrentTab(currentTab + 1); // Move to the next form tab
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(`/filled-forms/appointment/${appointmentId}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Toast("error", error?.message || "An error occurred");
      setSaving(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const formId = queryParams.get("formId");

    if (!forms.length) return;

    const startTab = formId ? forms.findIndex((form) => form.id === formId) : 0;

    if (startTab !== -1) {
      setCurrentTab(startTab);
    }
  }, [forms, location.search]);

  return (
    <div className="dynamic-forms">
      <div className="go-back" onClick={() => navigate(-1)}>
        <GoBackSvg />
        <p>Go back </p>
      </div>
      <div className="progress-container">
        <p className="progress-text">
          Form {currentTab + 1} of {forms.length}
        </p>
        <p>Carefully read and complete the form below, then click "Submit"</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentTab + 1) / forms.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {forms[currentTab] && (
        <div className="form-content">
          <h2>{forms[currentTab]?.title}</h2>
          {forms[currentTab]?.sections.map((section) => (
            <div key={section._id}>
              <h3>{section.title}</h3>
              {renderFormFields(section.data || [])}
            </div>
          ))}
          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "100%",
            }}
          >
            <button
              onClick={() => setCurrentTab(currentTab - 1)}
              disabled={saving || currentTab === 0}
              style={{
                backgroundColor: "#F4EAF4",
                color: "#8E2D8E",
              }}
            >
              Previous Form
            </button>

            <button
              onClick={
                filledForms.some(
                  (f) => f.formTemplateId === forms[currentTab]?.id
                )
                  ? // ? () => setCurrentTab(currentTab + 1)
                    handleSubmit
                  : handleSubmit
              }
              disabled={saving}
            >
              {filledForms.some(
                (f) => f.formTemplateId === forms[currentTab]?.id
              )
                ? "Next"
                : "Submit Form"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicForms;
