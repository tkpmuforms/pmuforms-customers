import axios from "axios";
import { getAuthToken } from "../firebase/firebaseServices";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "https://api.pmuforms.com", // Replace with your base URL
});

// Interceptor to add idToken to the request headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const idToken = getAuthToken();
    console.log("idToken", idToken);
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
