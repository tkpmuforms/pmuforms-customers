import dayjs from "dayjs";

// form field id -> key in the client's saved info
export const fieldToUserInfoMapping = {
  client_name: ["client_name"],
  "client-name": ["client_name"],

  "AEA66A04-E": ["date_of_birth"],
  date_of_birth: ["date_of_birth"],
  "date-of-birth": ["date_of_birth"],

  home_address: ["home_address"],
  "home-address": ["home_address"],

  emergency_contact_name: ["emergency_contact_name"],
  "emergency-contact-name": ["emergency_contact_name"],

  emergency_contact_phone: ["emergency_contact_phone"],
  "emergency-contact-phone": ["emergency_contact_phone"],

  home_phone: ["cell_phone"],
  "home-phone": ["cell_phone"],
};

const DATE_OF_BIRTH_FIELDS = ["date_of_birth", "date-of-birth", "AEA66A04-E"];

export const isDateOfBirthField = (fieldId) =>
  DATE_OF_BIRTH_FIELDS.includes(fieldId);

const hasField = (form, fieldId) =>
  form?.sections?.some((section) =>
    section?.data?.some((field) => field?.id === fieldId)
  );

/**
 * Pre-fills a form's "client information" section from the client's saved
 * details, plus age and today's date fields. Returns the values to merge into
 * the form response and the ids of the fields that were filled.
 */
export const buildAutofill = (form, info) => {
  const response = {};
  const fieldIds = new Set();

  if (!form?.sections?.some((section) => section.isClientInformation)) {
    return { response, fieldIds };
  }

  form.sections.forEach((section) => {
    if (!section.isClientInformation) return;

    section.data?.forEach((field) => {
      const userInfoKeys = fieldToUserInfoMapping[field.id];
      userInfoKeys?.forEach((key) => {
        if (!info?.[key]) return;

        let value = info[key];
        if (field.id === "date-of-birth" || field.id === "date_of_birth") {
          value = dayjs(value).format("YYYY-MM-DD");
        }

        response[field.id] = value;
        fieldIds.add(field.id);
      });
    });
  });

  const dob = response["date-of-birth"] || response["date_of_birth"];
  if (dob) {
    response["age"] = dayjs().diff(dayjs(dob), "year").toString();
    fieldIds.add("age");
  }

  const today = dayjs().format("YYYY-MM-DD");
  if (hasField(form, "date_of_signing")) {
    response["date_of_signing"] = today;
    fieldIds.add("date_of_signing");
  } else if (hasField(form, "date-of-signing")) {
    response["date-of-signing"] = today;
    fieldIds.add("date-of-signing");
  }

  if (hasField(form, "todays_date")) {
    response["todays_date"] = today;
    fieldIds.add("todays_date");
  }

  return { response, fieldIds };
};

/** Forms the client actually has something to fill in. */
export const hasVisibleSections = (form) =>
  form?.sections?.some((section) => !section.skip);

/** Swaps the {{user.businessName}} placeholder for the studio's name. */
export const withBusinessName = (form, businessName) =>
  JSON.parse(
    JSON.stringify(form).replace(
      /\(?\{\{user\.businessName\}\}\)?/g,
      // escaped so a name containing quotes can't break the JSON
      JSON.stringify(businessName || "").slice(1, -1)
    )
  );
