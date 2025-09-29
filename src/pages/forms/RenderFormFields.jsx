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
  formTemplateId,
  formResponse,
  requiredFieldsOnSubmit,
  autofilledFields,
  handleInputChange,
  handleImageChange
) =>
  fields?.map((field) => {
    if (!field?.id) return null;

    const fieldValue = formResponse?.[formTemplateId]?.[field?.id] || "";
    const filesValue = formResponse?.[formTemplateId]?.[field?.id]?.files || "";

    const isRequired = field?.required;
    const isFieldInvalid =
      !fieldValue && requiredFieldsOnSubmit?.includes(field?.id);
    const isAutofilled = autofilledFields?.has(field?.id);

    const commonProps = {
      className: isFieldInvalid ? "invalid-field" : "",
      onChange: (e) =>
        handleInputChange
          ? handleInputChange(formTemplateId, field?.id, e?.target?.value)
          : null,
      required: isRequired,
      readOnly: isAutofilled,
    };

    if (!field?.type) {
      return (
        <div key={field?.id} className="read-only-field">
          <label>{field?.title || ""}</label>
        </div>
      );
    }

    if (field?.id === "signature") {
      return (
        <div key={field?.id}>
          <label>
            {field?.title || ""}
            {isRequired ? <span className="required-star">*</span> : null}
            <input
              type="text"
              value={fieldValue}
              onChange={(e) =>
                handleInputChange
                  ? handleInputChange(
                      formTemplateId,
                      field?.id,
                      e?.target?.value
                    )
                  : null
              }
              {...commonProps}
              placeholder="Type your full name"
            />
          </label>
        </div>
      );
    }

    switch (field?.type) {
      case FormInputTypes.CHECKBOX:
        return (
          <div className="checkbox-group" key={field?.id}>
            <label>
              <input
                type="checkbox"
                checked={!!fieldValue}
                onChange={(e) =>
                  handleInputChange
                    ? handleInputChange(
                        formTemplateId,
                        field?.id,
                        e?.target?.checked
                      )
                    : null
                }
              />
              {field?.title || ""}
              {isRequired ? <span className="required-star">*</span> : null}
            </label>
          </div>
        );
      case FormInputTypes.DATE:
        const userTimezone = dayjs.tz.guess();
        const todayLocal = dayjs().tz(userTimezone).format("YYYY-MM-DD");

        if (field?.id === "todays_date" || field?.id === "date_of_signing") {
          return (
            <div key={field?.id}>
              <label>
                {field?.title || ""}
                {isRequired ? <span className="required-star">*</span> : null}
                <input
                  type="date"
                  min={todayLocal}
                  max={todayLocal}
                  value={fieldValue}
                  onChange={(e) =>
                    handleInputChange
                      ? handleInputChange(
                          formTemplateId,
                          field?.id,
                          e?.target?.value
                        )
                      : null
                  }
                />
              </label>
            </div>
          );
        }

        return (
          <div key={field?.id}>
            <label>
              {field?.title || ""}
              {isRequired ? <span className="required-star">*</span> : null}
              <input
                type="date"
                value={fieldValue}
                onChange={(e) =>
                  handleInputChange
                    ? handleInputChange(
                        formTemplateId,
                        field?.id,
                        e?.target?.value
                      )
                    : null
                }
              />
            </label>
          </div>
        );
      case FormInputTypes.IMAGE:
        const imageInputKey = `${formTemplateId}_${field?.id}`;
        const imageUploaded = !!fieldValue;
        return (
          <div key={field?.id}>
            <label>
              {field?.title || ""}
              {isRequired ? <span className="required-star">*</span> : null}
            </label>

            {imageUploaded ? (
              <div>
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
                <button
                  type="button"
                  onClick={() =>
                    handleInputChange
                      ? handleInputChange(formTemplateId, field?.id, "")
                      : null
                  }
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#eee",
                    color: "#333",
                  }}
                >
                  Replace Image
                </button>
              </div>
            ) : (
              <input
                key={imageInputKey}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange
                    ? handleImageChange(
                        formTemplateId,
                        field?.id,
                        e?.target?.files?.[0]
                      )
                    : null
                }
              />
            )}
          </div>
        );
      case FormInputTypes.NUMBER:
        return (
          <div key={field?.id}>
            <label>
              {field?.title || ""}
              {isRequired ? <span className="required-star">*</span> : null}
              <input type="number" value={fieldValue} {...commonProps} />
            </label>
          </div>
        );
      default:
        return (
          <div key={field?.id}>
            <label>
              {field?.title || ""}
              {isRequired ? <span className="required-star">*</span> : null}
              <input type="text" value={fieldValue} {...commonProps} />
            </label>
          </div>
        );
    }
  }) || [];
