import { CircularProgress } from "@mui/material";
import imageCompression from "browser-image-compression";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import {
  getFormLinkSession,
  submitFormLinkForm,
  uploadFormLinkImage,
} from "../../services/formLinkServices";
import {
  buildAutofill,
  hasVisibleSections,
  isDateOfBirthField,
  withBusinessName,
} from "../forms/formAutofill";
import { renderFormFields } from "../forms/RenderFormFields";
import "../forms/dynamicForms.scss";
import "./formLinkPage.scss";

/**
 * Public page for a form link an artist shared, e.g. handed over on the studio
 * tablet. No login, no menu and no way to reach anything except this one
 * appointment's forms; the link itself is the only credential.
 */
const FormLinkPage = () => {
  const { token } = useParams();
  const { showAlert } = useSnackbar();

  const [session, setSession] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [formResponse, setFormResponse] = useState({});
  const [autofilledFields, setAutofilledFields] = useState(new Set());
  const [requiredFieldsOnSubmit, setRequiredFieldsOnSubmit] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getFormLinkSession(token)
      .then((data) => {
        if (cancelled) return;
        setSession(data);
        setCompletedIds(data.completedFormIds || []);
      })
      .catch((error) => !cancelled && setLoadError(error));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const forms = useMemo(
    () =>
      (session?.forms || [])
        .filter(hasVisibleSections)
        .map((form) => withBusinessName(form, session?.business?.name)),
    [session]
  );

  const remainingForms = forms.filter((form) => !completedIds.includes(form.id));
  // completed forms can't be changed through a link, so just go in order
  const currentForm = remainingForms[0];

  // pre-fill each form from the client's saved details the first time it shows
  useEffect(() => {
    if (!currentForm || formResponse[currentForm.id]) return;
    const { response, fieldIds } = buildAutofill(
      currentForm,
      session?.client?.info
    );
    setFormResponse((prev) => ({ ...prev, [currentForm.id]: response }));
    setAutofilledFields(fieldIds);
  }, [currentForm, formResponse, session]);

  const handleInputChange = useCallback((formId, fieldId, value) => {
    setFormResponse((prev) => {
      const next = { ...prev[formId], [fieldId]: value };
      if (isDateOfBirthField(fieldId) && value) {
        next.age = dayjs().diff(dayjs(value), "year").toString();
      }
      return { ...prev, [formId]: next };
    });
  }, []);

  const handleImageChange = async (formId, fieldId, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      });
      const url = await uploadFormLinkImage(token, compressed);
      handleInputChange(formId, fieldId, url);
      showAlert("success", "Image uploaded");
    } catch (error) {
      console.error("Error uploading image:", error);
      showAlert("error", error?.message || "Could not upload the image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentForm) return;
    const answers = formResponse[currentForm.id] || {};

    const missing = currentForm.sections
      .flatMap((section) => section.data?.filter((f) => f.required) || [])
      .filter((field) => !answers[field?.id]);
    setRequiredFieldsOnSubmit(missing.map((field) => field.id));
    if (missing.length > 0) {
      showAlert("error", "Please fill out all required fields");
      return;
    }

    setSaving(true);
    try {
      await submitFormLinkForm(token, currentForm.id, answers);
      setCompletedIds((prev) => [...prev, currentForm.id]);
      // nothing written on this device stays around once it is sent
      setFormResponse((prev) => {
        const { [currentForm.id]: _sent, ...rest } = prev;
        return rest;
      });
      setRequiredFieldsOnSubmit([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error?.status === 410 || error?.status === 404) {
        setLoadError(error);
      } else {
        showAlert("error", error?.message || "Could not submit the form");
      }
    } finally {
      setSaving(false);
    }
  };

  const businessName = session?.business?.name;
  const firstName = session?.client?.name?.split(" ")[0];

  const header = (
    <header className="form-link-page__brand">
      {session?.business?.logoUrl ? (
        <img
          src={session.business.logoUrl}
          alt=""
          className="form-link-page__logo"
        />
      ) : null}
      <span>{businessName || "PMU Forms"}</span>
    </header>
  );

  if (loadError) {
    return (
      <main className="form-link-page">
        {header}
        <section className="form-link-page__message">
          <h1>
            {loadError.status === 410
              ? "This link has expired"
              : "This link can't be opened"}
          </h1>
          <p>{loadError.message}</p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="form-link-page form-link-page--loading">
        <CircularProgress color="secondary" />
      </main>
    );
  }

  if (!currentForm) {
    return (
      <main className="form-link-page">
        {header}
        <section className="form-link-page__message form-link-page__message--done">
          <div className="form-link-page__check" aria-hidden="true">
            ✓
          </div>
          <h1>
            {forms.length === 0
              ? "No forms to fill out"
              : `All done${firstName ? `, ${firstName}` : ""}!`}
          </h1>
          <p>
            {forms.length === 0
              ? "There are no forms for this appointment yet."
              : `Your forms have been sent to ${businessName || "your artist"}.`}
          </p>
          <p className="form-link-page__handback">
            If you are using the studio's device, please hand it back now.
          </p>
        </section>
      </main>
    );
  }

  const position = forms.length - remainingForms.length + 1;

  return (
    <main className="form-link-page">
      {header}

      <div className="dynamic-forms form-link-page__forms">
        <div className="form-link-page__intro">
          <h1>{firstName ? `Hi ${firstName}!` : "Welcome!"}</h1>
          <p>
            Please fill out {forms.length === 1 ? "this form" : "these forms"}{" "}
            for your appointment
            {session.appointment?.date
              ? ` on ${dayjs(session.appointment.date).format("dddd, MMMM D")}`
              : ""}
            .
          </p>
        </div>

        <div className="progress-container">
          <p className="progress-text">
            Form {position} of {forms.length}
          </p>
          <p>Carefully read and complete the form below, then tap "Submit".</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(position / forms.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="form-content" key={currentForm.id}>
          <h2>{currentForm.title}</h2>
          {/* same sections as the logged-in form page, which the API also
              uses to decide when a form is complete */}
          {currentForm.sections.map((section) => (
            <div key={section._id || section.id || section.title}>
              <h3>{section.title}</h3>
              {renderFormFields(
                section.data,
                currentForm.id,
                formResponse,
                requiredFieldsOnSubmit,
                autofilledFields,
                handleInputChange,
                handleImageChange
              )}
            </div>
          ))}

          <button
            type="button"
            className="form-link-page__submit"
            onClick={handleSubmit}
            disabled={saving || uploading}
            aria-busy={saving}
          >
            {saving
              ? "Submitting..."
              : uploading
                ? "Uploading image..."
                : remainingForms.length === 1
                  ? "Submit"
                  : "Submit and continue"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default FormLinkPage;
