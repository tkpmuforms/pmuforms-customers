import axiosInstance from "../context/axiossetup";

export const createCustomer = (data) =>
  axiosInstance.post(`/api/auth/customer/create`, data);

export const getAllAppointments = async (page, itemsPerPage) => {
  try {
    const response = await axiosInstance.get("/api/appointments/customer", {
      params: {
        page, // Current page number
        perPage: itemsPerPage, // Number of items per page
      },
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error; // Rethrow error for the caller to handle
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/appointments/${appointmentId}`
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error(
      `Error deleting appointment with ID ${appointmentId}:`,
      error
    );
    throw error; // Rethrow error for the caller to handle
  }
};

export const bookAppointment = async (data) => {
  try {
    const response = await axiosInstance.post(
      "api/appointments/customer/book-appointment",
      data
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error; // Rethrow error for the caller to handle
  }
};

export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await axiosInstance.get(
      `/api/appointments/${appointmentId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching appointment with ID ${appointmentId}:`,
      error
    );
    throw error;
  }
};

export const getAuthenticatedUser = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching authenticated user details:", error);
    throw error;
  }
};

export const getArtistServices = async (artistId) => {
  try {
    const response = await axiosInstance.get(
      `/api/services/artist-services/${artistId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching services for artist with ID ${artistId}:`,
      error
    );
    throw error;
  }
};

// Get details of a specific service
export const getServiceById = async (serviceId) => {
  try {
    const response = await axiosInstance.get(`/api/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service with ID ${serviceId}:`, error);
    throw error;
  }
};

export const SavePersonalInformation = async (data) => {
  try {
    const response = await axiosInstance.patch(
      "/api/customers/personal-details",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error saving personal information:", error);
    throw error;
  }
};

export const getArtistById = async (artistId) => {
  try {
    const response = await axiosInstance.get(`/api/artists/${artistId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching artist with ID ${artistId}:`, error);
    throw error;
  }
};

export const getFormsForAppointMentById = async (appointmentId) => {
  try {
    const response = await axiosInstance.get(
      `/api/forms/appointment/${appointmentId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching forms for appointment with ID ${appointmentId}:`,
      error
    );
    throw error;
  }
};

export const getAllFilledFormsForAppointment = async (appointmentId) => {
  try {
    const response = await axiosInstance.get(
      `/api/filled-forms/appointment/${appointmentId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching filled forms for appointment with ID ${appointmentId}:`,
      error
    );
    throw error;
  }
};

export const createFilledForm = async (data) => {
  try {
    const response = await axiosInstance.post("/api/filled-forms/submit", data);
    return response.data;
  } catch (error) {
    console.error("Error creating filled form:", error);
    throw error;
  }
};

export const getRootTemplateForm = () => {
  return axiosInstance.get("/api/forms/root-templates");
};

export const sendMessage = async (data) => {
  try {
    const response = await axiosInstance.post("/api/messages", data);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
