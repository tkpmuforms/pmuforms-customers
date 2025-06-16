import axiosInstance from "../context/axiossetup";

export const createCustomer = (data) =>
  axiosInstance.post(`/api/auth/customer/create`, data);

export const sendVerificationLink = (id) =>
  axiosInstance.get(`/api/auth/send-email-verification/${id}`);

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
    // Determine if we're booking as an artist for a customer
    const isArtist = localStorage.getItem("isArtist");
    let endpoint = "api/appointments/customer/book-appointment";
    if (isArtist && data.customerId) {
      endpoint = `api/appointments/customer/book-appointment?customerId=${data.customerId}`;
    }
    const response = await axiosInstance.post(endpoint, data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw error; // Rethrow error for the caller to handle
  }
};
export const createFilledForm = async (data) => {
  try {
    const isArtist = localStorage.getItem("isArtist");
    let endpoint = "/api/filled-forms/submit";
    if (isArtist && data.customerId) {
      endpoint = `/api/filled-forms/submit?customerId=${data.customerId}`;
    }
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error creating filled form:", error);
    throw error;
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

export const searchArtist = async (name) => {
  try {
    const response = await axiosInstance.get("/api/artists/search", {
      params: { name },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching for artists:", error);
    throw error;
  }
};

export const switchArtist = async (artistId) => {
  try {
    const response = await axiosInstance.post(
      "/api/auth/customer/switch-context",
      {
        artistId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error switching artist:", error);
    throw error;
  }
};

export const getMyCustomers = async (page = 1, limit = 5) => {
  try {
    const response = await axiosInstance.get("/api/customers/my-customers", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my customers:", error);
    throw error;
  }
};

export const searchMyCustomers = async (name, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      "/api/customers/my-customers/search",
      {
        params: {
          name,
          page,
          limit,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching my customers:", error);
    throw error;
  }
};

export const artistCreateCustomer = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/api/customers/my-customers/create-customer",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating customer as artist:", error);
    throw error;
  }
};
