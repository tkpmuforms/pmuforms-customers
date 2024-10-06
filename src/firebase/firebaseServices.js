import { firestore, auth } from "./firebase";
import axios from "axios";

const BASE_URL = "https://api.pmuforms.com";

/**
 * Logs a message to Firestore 'log' collection.
 */
export const log = async (message, error = "") => {
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");
  const artistId = localStorage.getItem("artistId");
  const artistBusinessName = localStorage.getItem("businessName");

  try {
    await firestore.collection("log").add({
      log: message.toString(),
      error: error,
      time: new Date(),
      userId,
      artistId,
      businessName: artistBusinessName,
      userEmail,
    });
    console.log(message);
  } catch (err) {
    console.error("Error logging to server", err);
  }
};

/**
 * Creates a new customer for an artist.
 */
export const createCustomer = async (email, name, id) => {
  try {
    const customerRef = firestore.collection("customers").doc(id);
    const customer = await customerRef.get();
    if (!customer.exists) {
      await customerRef.set({
        email,
        info: { client_name: name },
        id,
      });
      log("User added to customers collection successfully");
      return true;
    }
  } catch (err) {
    log("Error creating customer", err);
    throw err;
  }
};

/**
 * Gets all services from Firestore.
 */
export const getAllServices = async () => {
  try {
    const servicesSnapshot = await firestore.collection("services").get();
    return servicesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    log("Error getting all services", err);
    throw err;
  }
};

/**
 * Retrieves all forms for a specific service.
 */
export const getAllFormsForService = async (id) => {
  try {
    const formsSnapshot = await firestore
      .collection("form-templates")
      .where("services", "array-contains", id)
      .get();
    return formsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.get("title"),
    }));
  } catch (err) {
    log("Error getting forms for service", err);
    throw err;
  }
};

/**
 * Stores artist information in local storage.
 */
export const storeArtistInformation = (businessName, artistId) => {
  localStorage.setItem("businessName", businessName);
  localStorage.setItem("artistId", artistId);
};

/**
 * Stores logged-in user information in local storage.
 */
export const storeLoggedInUserInformation = (userId, userEmail) => {
  localStorage.setItem("userId", userId);
  localStorage.setItem("userEmail", userEmail);
};

/**
 * Gets artist information by user ID.
 */
export const getArtist = async (userId) => {
  try {
    const artistDoc = await firestore.collection("users").doc(userId).get();
    return artistDoc.data();
  } catch (err) {
    log("Error getting artist information", err);
    throw err;
  }
};

/**
 * Authenticates the user and stores the token in local storage.
 */
export const setAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const idToken = await user.getIdToken(true);
      localStorage.setItem("idToken", idToken);
    } catch (err) {
      log("Error retrieving auth token", err);
    }
  } else {
    console.log("User not authenticated");
  }
};

/**
 * Checks if a user is logged in.
 */
export const isLoggedIn = () => {
  return auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "/login"; // Redirect to login page
    }
  });
};

/**
 * Logs the user out and clears local storage.
 */
export const logout = async () => {
  try {
    await auth.signOut();
    localStorage.clear();
  } catch (err) {
    log("Error during logout", err);
  }
};

/**
 * Retrieves all filled forms for a specific appointment.
 */
export const getAllFilledFormsForAppointment = async (appointmentId) => {
  try {
    const formsSnapshot = await firestore
      .collection("filled-forms")
      .where("appointment_id", "==", appointmentId)
      .get();
    return formsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    log("Error getting filled forms for appointment", err);
    throw err;
  }
};

/**
 * Retrieves all services offered by a specific artist.
 */
export const getServicesForArtistWithId = async (id) => {
  try {
    const artistDoc = await getArtist(id);
    return artistDoc.services;
  } catch (err) {
    log("Error getting services for artist", err);
    throw err;
  }
};

/**
 * Creates a new appointment in the Firestore database.
 */
export const createAppointment = async (appointment) => {
  try {
    await firestore
      .collection("appointments")
      .doc(appointment.id)
      .set(appointment);
  } catch (err) {
    log("Error creating appointment", err);
    throw err;
  }
};

/**
 * Retrieves root form templates from the backend server.
 */
export const getRootTemplates = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/forms`);
    return response.data;
  } catch (err) {
    log("Error getting root templates", err);
    throw err;
  }
};

/**
 * Retrieves the latest version of a form template for an artist.
 */
export const getLatestTemplateVersion = async (
  rootTemplateId,
  artistId,
  services
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/artists/${artistId}/forms/${rootTemplateId}/latest`
    );
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      if (!data[0].usesServicesArrayVersioning) {
        data[0].services = services;
      }
      return data[0];
    }
    return data;
  } catch (err) {
    log("Error getting latest template version", err);
    throw err;
  }
};
