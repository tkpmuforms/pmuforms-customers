import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createFilledForm,
  getFormsForAppointMentById,
} from "../../services/services";
import { GoBackSvg } from "../../assets/svgs/DashboardSvg";
import "./dynamicForms.scss";

const FormInputTypes = {
  TEXT: "text",
  CHECKBOX: "checkbox",
  IMAGE: "image",
  DATE: "date",
  TEXTFIELD: "textfield",
  NUMBER: "number",
};

const DynamicForms = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [formResponse, setFormResponse] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const fetchedForms = await getFormsForAppointMentById(appointmentId);
        setForms(fetchedForms?.forms || []);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, [appointmentId]);

  const handleInputChange = (fieldId, value) => {
    setFormResponse((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleImageChange = (fieldId, file) => {
    // Optionally upload to a server or preview the image locally
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormResponse((prev) => ({
        ...prev,
        [fieldId]: e.target.result, // Save base64-encoded image string or file URL
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const currentForm = forms[currentTab];
    if (!currentForm) return;

    const requiredFields = currentForm.sections.flatMap(
      (section) => section.data?.filter((field) => field.required) || []
    );

    const missingFields = requiredFields.some(
      (field) => !formResponse[field.id]
    );

    if (missingFields) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      await createFilledForm({
        appointmentId,
        formTemplateId: currentForm.id,
        data: formResponse,
      });

      setFormError("");
      setFormResponse({});

      if (currentTab < forms.length - 1) {
        setCurrentTab(currentTab + 1);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(
        "An error occurred while submitting the form. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderFormFields = (fields) =>
    fields.map((field) => {
      const fieldValue = formResponse[field.id] || "";

      switch (field.type) {
        case FormInputTypes.CHECKBOX:
          return (
            <div className="checkbox-group" key={field.id}>
              <label>
                <input
                  type="checkbox"
                  checked={fieldValue}
                  onChange={(e) =>
                    handleInputChange(field.id, e.target.checked)
                  }
                />
                {field.title}
              </label>
            </div>
          );
        case FormInputTypes.DATE:
          return (
            <div key={field.id}>
              <label>
                {field.title}
                <input
                  type="date"
                  value={fieldValue}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              </label>
            </div>
          );
        case FormInputTypes.IMAGE:
          return (
            <div key={field.id}>
              <label>
                {field.title}
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
                  <img src={fieldValue} alt="Preview" />
                </div>
              )}
            </div>
          );
        case FormInputTypes.NUMBER:
          return (
            <div key={field.id}>
              <label>
                {field.title}
                <input
                  type="number"
                  value={fieldValue}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              </label>
            </div>
          );
        default:
          return (
            <div key={field.id}>
              <label>
                {field.title}
                <input
                  type="text"
                  value={fieldValue}
                  placeholder={field.placeholder || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  required={field.required}
                />
              </label>
            </div>
          );
      }
    });

  return (
    <div className="dynamic-forms">
      <div className="go-back" onClick={() => navigate("/dashboard")}>
        <GoBackSvg />
        <p>Go back to dashboard</p>
      </div>
      {formError && <div className="error-message">{formError}</div>}
      <div className="tabs">
        {forms?.map((form, index) => (
          <button
            key={form.id}
            className={index === currentTab ? "active" : ""}
            onClick={() => setCurrentTab(index)}
            disabled={saving}
          >
            {form.title}
          </button>
        ))}
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {currentTab > 0 && (
              <button
                onClick={() => setCurrentTab(currentTab - 1)}
                disabled={saving}
              >
                Go Back
              </button>
            )}
            <button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Submit Form"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicForms;
