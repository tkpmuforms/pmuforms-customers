import axiosInstance from "../context/axiossetup";

export const createCustomer = (data) =>
  axiosInstance.post(`/api/auth/customer/create`, data);

export const getAllAppointments = async () => {
  try {
    const response = await axiosInstance.get("/api/appointments/customer");
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
      "/api/appointments/book-appointment",
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
