import axios from "axios";

/**
 * Calls for no-login form links. Deliberately a separate client from the
 * logged-in one in context/axiossetup: it never sends anyone's login token and
 * never redirects to the login page, so a link opened on a shared device can't
 * pick up or affect whoever was signed in there.
 */
const formLinkClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
});

const toError = (error) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;
  return {
    status,
    message: Array.isArray(message)
      ? message.join(", ")
      : message || "Something went wrong. Please try again.",
  };
};

export const getFormLinkSession = async (token) => {
  try {
    const { data } = await formLinkClient.get(
      `/api/form-links/${encodeURIComponent(token)}`
    );
    return data;
  } catch (error) {
    throw toError(error);
  }
};

export const submitFormLinkForm = async (token, formTemplateId, data) => {
  try {
    const response = await formLinkClient.post(
      `/api/form-links/${encodeURIComponent(
        token
      )}/forms/${encodeURIComponent(formTemplateId)}`,
      { data }
    );
    return response.data;
  } catch (error) {
    throw toError(error);
  }
};

export const uploadFormLinkImage = async (token, file) => {
  const body = new FormData();
  body.append("file", file, file.name || "image");
  try {
    const { data } = await formLinkClient.post(
      `/api/form-links/${encodeURIComponent(token)}/images`,
      body
    );
    return data.url;
  } catch (error) {
    throw toError(error);
  }
};
