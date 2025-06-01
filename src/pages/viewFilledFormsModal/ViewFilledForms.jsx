import { useEffect, useState } from "react";
import { getAllFilledFormsForAppointment } from "../../services/services";
import "./viewFilledForms.scss";

const FormInputTypes = {
  TEXT: "text",
  CHECKBOX: "checkbox",
  IMAGE: "image",
  DATE: "date",
  TEXTFIELD: "textfield",
  NUMBER: "number",
};

const ViewFilledForm = ({ appointmentId, formTemplateId }) => {
  const [form, setForm] = useState(null);
  const [filledForm, setFilledForm] = useState(null);

  useEffect(() => {
    const fetchFilledForm = async () => {
      try {
        const fetchedFilledForms = await getAllFilledFormsForAppointment(
          appointmentId
        );
        const targetFilledForm = fetchedFilledForms?.filledForms?.find(
          (f) => f.formTemplateId === formTemplateId
        );
        setFilledForm(targetFilledForm?.data || {});
        setForm(targetFilledForm?.formTemplate || {});
      } catch (error) {
        console.error("Error fetching filled form:", error);
      }
    };

    fetchFilledForm();
  }, [appointmentId, formTemplateId]);

  const renderFormFields = (fields) =>
    fields.map((field) => {
      const fieldValue = filledForm?.[field.id];

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
            <div className="read-only-field checkbox-group" key={field.id}>
              <label className="checkbox-label">
                <input type="checkbox" checked={!!fieldValue} disabled />{" "}
                <span>{field.title}</span>
              </label>
            </div>
          );

        case FormInputTypes.DATE:
          return (
            <div key={field.id} className="read-only-field">
              <label>{field.title}</label>
              <p>{new Date(fieldValue).toLocaleDateString() || ""}</p>
            </div>
          );

        case FormInputTypes.IMAGE:
          return (
            <div key={field.id} className="read-only-field image-field">
              <label>{field.title}</label>

              {fieldValue ? (
                <div className="image-preview">
                  <img
                    src={fieldValue}
                    alt="Uploaded Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "150px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ) : (
                <p>No Image</p>
              )}
            </div>
          );

        case FormInputTypes.NUMBER:
          return (
            <div key={field.id} className="read-only-field">
              <label>{field.title}</label>
              <p>{fieldValue}</p>
            </div>
          );

        default:
          return (
            <div key={field.id} className="read-only-field">
              <label>{field.title}</label>
              <p>{fieldValue}</p>
            </div>
          );
      }
    });

  return (
    <div className="view-filled-form">
      {form ? (
        <div className="form-content">
          <h2>{form.title}</h2>
          {form?.sections.map((section) => (
            <div key={section._id} className="form-section">
              <h3>{section.title}</h3>
              {renderFormFields(section.data || [])}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading form...</p>
      )}
    </div>
  );
};

export default ViewFilledForm;
