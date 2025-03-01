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
  formResponse,
  requiredFieldsOnSubmit,
  autofilledFields,
  handleInputChange,
  handleSignatureBlur,
  handleImageChange
) =>
  fields.map((field) => {
    if (!field || !field.id) return null;
    const fieldValue = formResponse[field?.id] || "";
    const isRequired = field.required;
    const isFieldInvalid =
      !fieldValue && requiredFieldsOnSubmit.includes(field.id);
    const isAutofilled = autofilledFields.has(field.id);

    const fieldClass =
      field.line === "full" ? "form-field full-width" : "form-field half-width";

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

    if (field.id === "signature") {
      return (
        <div key={field.id}>
          <label>
            {field.title}
            {isRequired && <span className="required-star">*</span>}
            <input
              type="text"
              value={fieldValue}
              {...commonProps}
              placeholder="Type your full name"
              onBlur={() => handleSignatureBlur(fieldValue)}
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
                onChange={(e) => handleInputChange(field.id, e.target.checked)}
                disabled={isAutofilled}
              />
              {field.title}
              {isRequired && <span className="required-star">*</span>}
            </label>
          </div>
        );
      case FormInputTypes.DATE:
        const userTimezone = dayjs.tz.guess(); // Get user's timezone
        const todayLocal = dayjs().tz(userTimezone).format("YYYY-MM-DD"); // Ensure correct format

        // Handle special cases for `todays_date` and `date_of_signing`
        if (field.id === "todays_date" || field.id === "date_of_signing") {
          return (
            <div key={field.id}>
              <label>
                {field.title}
                {isRequired && <span className="required-star">*</span>}
                <input
                  type="date"
                  min={todayLocal} // Prevent past dates
                  max={todayLocal} // Lock it to today’s date
                  value={formResponse[field.id] || todayLocal} // Default to today's date if empty
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
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
                value={formResponse[field.id] || ""}
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
              {isRequired && <span className="required-star">*</span>}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(field.id, e.target.files[0])}
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
