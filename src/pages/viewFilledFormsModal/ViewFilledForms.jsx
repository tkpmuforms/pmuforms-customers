import React, { useEffect, useState } from "react";
import {
  getAllFilledFormsForAppointment,
  getFormsForAppointMentById,
} from "../../services/services";
import "./viewFilledForms.scss";

const ViewFilledForm = ({ appointmentId, formTemplateId }) => {
  const [form, setForm] = useState(null);
  const [filledForm, setFilledForm] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const fetchedForms = await getFormsForAppointMentById(appointmentId);
        const targetForm = fetchedForms?.forms?.find(
          (f) => f.id === formTemplateId
        );
        if (!targetForm) {
          console.error("Form not found");
          return;
        }
        setForm(targetForm);
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    const fetchFilledForm = async () => {
      try {
        const fetchedFilledForms = await getAllFilledFormsForAppointment(
          appointmentId
        );
        const targetFilledForm = fetchedFilledForms?.filledForms?.find(
          (f) => f.formTemplateId === formTemplateId
        );
        setFilledForm(targetFilledForm?.data || {});
      } catch (error) {
        console.error("Error fetching filled form:", error);
      }
    };

    fetchForm();
    fetchFilledForm();
  }, [appointmentId, formTemplateId]);

  const renderFormFields = (fields) =>
    fields.map((field) => {
      if (!field || !field.id) return null;
      const fieldValue = filledForm?.[field?.id] || "N/A";

      return (
        <div key={field.id} className="read-only-field">
          <label>{field.title}</label>
          <p>{fieldValue}</p>
        </div>
      );
    });

  return (
    <div className="view-filled-form">
      {form ? (
        <div className="form-content">
          <h2>{form.title}</h2>
          {form?.sections.map((section) => (
            <div key={section._id}>
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
