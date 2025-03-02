import imageCompression from "browser-image-compression";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GoBackSvg } from "../../assets/svgs/DashboardSvg";
import { useSnackbar } from "../../context/SnackbarContext";
import useAuth from "../../context/useAuth";
import { storage } from "../../firebase/firebase";
import {
  createFilledForm,
  getAllFilledFormsForAppointment,
  getFormsForAppointMentById,
} from "../../services/services";
import "./dynamicForms.scss";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { renderFormFields } from "./RenderFormFields";

dayjs.extend(utc);
dayjs.extend(timezone);

//calcualte age from date of birth
const fieldToUserInfoMapping = {
  client_name: ["client_name"],
  // signature: ["client_name"],
  "AEA66A04-E": ["date_of_birth"],
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
  const { showAlert } = useSnackbar();
  const [requiredFieldsOnSubmit, setRequiredFieldsOnSubmit] = useState([]);
  const [autofilledFields, setAutofilledFields] = useState(new Set());

  useEffect(() => {
    const fetchFilledForms = async () => {
      try {
        const fetchedFilledForms = await getAllFilledFormsForAppointment(
          appointmentId
        );
        setFilledForms(fetchedFilledForms?.filledForms || []);

        // Store each form's data under its own formTemplateId
        const formattedResponses = {};
        fetchedFilledForms?.filledForms.forEach((filledForm) => {
          formattedResponses[filledForm.formTemplateId] = filledForm.data || {};
        });

        setFormResponse(formattedResponses);
      } catch (error) {
        console.error("Error fetching filled forms:", error);
      }
    };

    const fetchForms = async () => {
      try {
        const fetchedForms = await getFormsForAppointMentById(appointmentId);
        const updatedForms = fetchedForms?.forms
          .filter((form) => form.sections.some((section) => !section.skip))
          .map((form) =>
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
      setFormResponse((prev) => ({
        ...prev,
        [currentForm.id]: filledForm?.data || {},
      }));
    } else if (
      currentForm?.sections.some((section) => section.isClientInformation)
    ) {
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
                  if (
                    field.id === "date_of_birth" ||
                    field.id === "AEA66A04-E"
                  ) {
                    value = dayjs(value).format("MM-DD-YYYY");
                  }

                  autofillResponse[field.id] = value;
                  autofilledFieldIds.add(field.id);
                }
              });
            }

            // Automatically calculate age from date of birth
            if (
              autofillResponse["date_of_birth"] ||
              autofillResponse["AEA66A04-E"]
            ) {
              const birthDate = dayjs(
                autofillResponse["date_of_birth"] ||
                  autofillResponse["AEA66A04-E"]
              );
              const today = dayjs();
              const age = today.diff(birthDate, "year");

              autofillResponse["age"] = age.toString();
              autofilledFieldIds.add("age");
            }
          });
        }
      });

      setFormResponse((prev) => ({
        ...prev,
        [currentForm.id]: autofillResponse,
      }));
      setAutofilledFields(autofilledFieldIds);
    }
  }, [forms, filledForms, currentTab, user]);

  const handleInputChange = (currentForm, fieldId, value) => {
    if (!currentForm) return;
    // console.log(
    //   currentForm.id,
    //   currentForm,
    //   "fieldId",
    //   fieldId,
    //   "value",
    //   value
    // );
    setFormResponse((prev) => ({
      ...prev,
      [currentForm]: {
        ...prev[currentForm],
        [fieldId]: value,
      },
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

      const currentForm = forms[currentTab];
      if (!currentForm) return;

      setFormResponse((prev) => ({
        ...prev,
        [currentForm.id]: {
          ...prev[currentForm.id],
          [fieldId]: downloadUrl,
        },
      }));

      showAlert("success", "Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      showAlert("error", "Error uploading image");
    }
  };

  const handleSubmit = async () => {
    const currentForm = forms[currentTab];
    if (!currentForm) return;

    const requiredFields = currentForm?.sections.flatMap(
      (section) => section.data?.filter((field) => field.required) || []
    );

    const missingFields = requiredFields?.filter(
      (field) => !formResponse[currentForm.id]?.[field?.id]
    );

    setRequiredFieldsOnSubmit(missingFields?.map((field) => field.id));

    if (missingFields.length > 0) {
      showAlert("error", "Please fill out all required fields");
      return;
    }

    setSaving(true);
    try {
      await createFilledForm({
        appointmentId,
        formTemplateId: currentForm.id,
        data: formResponse[currentForm.id] || {}, // Send only the fields for the current form
      });

      setSaving(false);
      const fetchedFilledForms = await getAllFilledFormsForAppointment(
        appointmentId
      );
      setFilledForms(fetchedFilledForms?.filledForms || []);

      if (currentTab < forms.length - 1) {
        setCurrentTab(currentTab + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(`/filled-forms/appointment/${appointmentId}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showAlert("error", "Error submitting form");
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
              {renderFormFields(
                section.data,
                forms[currentTab]?.id,
                formResponse,
                requiredFieldsOnSubmit,
                autofilledFields,
                handleInputChange,
                handleImageChange
              )}
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
