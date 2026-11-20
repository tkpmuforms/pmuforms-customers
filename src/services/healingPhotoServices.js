import axios from "axios";

/**
 * Calls for the no-login healing photo link in an artist's check-in email.
 * Like formLinkServices, a separate client that never sends a login token.
 */
const healingPhotoClient = axios.create({
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

export const getHealingPhotoSession = async (token) => {
  try {
    const { data } = await healingPhotoClient.get(
      `/api/healing-photos/${encodeURIComponent(token)}`
    );
    return data;
  } catch (error) {
    throw toError(error);
  }
};

export const uploadHealingPhoto = async (token, file) => {
  const body = new FormData();
  body.append("file", file, file.name || "photo.jpg");
  try {
    const { data } = await healingPhotoClient.post(
      `/api/healing-photos/${encodeURIComponent(token)}`,
      body
    );
    return data;
  } catch (error) {
    throw toError(error);
  }
};
