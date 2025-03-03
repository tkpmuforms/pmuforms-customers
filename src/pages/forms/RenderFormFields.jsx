import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const FormInputTypes = {
  TEXT: "text",
  CHECKBOX: "checkbox",
  IMAGE: "image",
  DATE: "date",
  TEXTFIELD: "textfield",
  NUMBER: "numberOfField",
};

export const renderFormFields = (
  fields,
  formTemplateId, // Pass the form ID to uniquely store data
  formResponse,
  requiredFieldsOnSubmit,
  autofilledFields,
  handleInputChange,
  handleImageChange
) =>
  fields.map((field) => {
    if (!field || !field.id) return null;
    const fieldValue = formResponse?.[formTemplateId]?.[field.id] || ""; // Retrieve field value using formTemplateId

    const isRequired = field?.required;
    const isFieldInvalid =
      !fieldValue && requiredFieldsOnSubmit?.includes(field.id);
    const isAutofilled = autofilledFields?.has(field.id);

    const commonProps = {
      className: isFieldInvalid ? "invalid-field" : "",
      onChange: (e) =>
        handleInputChange(formTemplateId, field.id, e.target.value), // Pass formTemplateId
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

    if (field.id === "signature") {
      return (
        <div key={field.id}>
          <label>
            {field.title}
            {isRequired && <span className="required-star">*</span>}
            <input
              type="text"
              value={fieldValue}
              onChange={(e) =>
                handleInputChange(formTemplateId, field.id, e.target.value)
              }
              {...commonProps}
              placeholder="Type your full name"
            />
          </label>
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
                  handleInputChange(formTemplateId, field.id, e.target.checked)
                }
                disabled={isAutofilled}
              />
              {field.title}
              {isRequired && <span className="required-star">*</span>}
            </label>
          </div>
        );
      case FormInputTypes.DATE:
        const userTimezone = dayjs.tz.guess(); // Get user's timezone
        const todayLocal = dayjs().tz(userTimezone).format("YYYY-MM-DD");

        if (field.id === "todays_date" || field.id === "date_of_signing") {
          return (
            <div key={field.id}>
              <label>
                {field.title}
                {isRequired && <span className="required-star">*</span>}
                <input
                  type="date"
                  min={todayLocal}
                  max={todayLocal}
                  value={fieldValue}
                  onChange={(e) =>
                    handleInputChange(formTemplateId, field.id, e.target.value)
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
              <input
                type="date"
                value={fieldValue}
                onChange={(e) =>
                  handleInputChange(formTemplateId, field.id, e.target.value)
                }
              />
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
                  handleImageChange(formTemplateId, field.id, e.target.files[0])
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
