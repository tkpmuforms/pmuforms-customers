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
        if (field.id === "date_of_signing" || field.id === "todays_date") {
          const userTimezone = dayjs.tz.guess(); // Detect user's timezone
          const todayLocal = dayjs().tz(userTimezone).format("MM-DD-YYYY");

          return (
            <div key={field.id}>
              <label>
                {field.title}
                {isRequired && <span className="required-star">*</span>}
                <input
                  type="date"
                  min={todayLocal}
                  max={todayLocal}
                  value={
                    formResponse[field.id]
                      ? dayjs(formResponse[field.id])
                          .tz(userTimezone)
                          .format("MM-DD-YYYY")
                      : todayLocal
                  }
                  onChange={(e) => {
                    const selectedDate = dayjs(e.target.value)
                      .tz(userTimezone)
                      .utc()
                      .toISOString(); // Convert to UTC before storing
                    handleInputChange(field.id, selectedDate);
                  }}
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
