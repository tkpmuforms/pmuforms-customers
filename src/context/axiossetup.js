import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://admin.pmuforms.com",
});

// Interceptor to add idToken to the request headers
axiosInstance.interceptors.request.use(
  async (config) => {
    // if (idToken) {
    //   config.headers.Authorization = `Bearer ${idToken}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
