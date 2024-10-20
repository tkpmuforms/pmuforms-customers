// src/services/firebaseService.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore, auth } from "../firebase/firebase";
import axiosInstance from "../context/axiossetup";

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
    await setDoc(doc(collection(firestore, "log")), {
      log: message.toString(),
      error: error || "",
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
 * Create a new customer for an artist.
 */
export const createCustomer = async (email, name, id) => {
  try {
    const customerRef = doc(firestore, "customers", id);
    const customer = await getDoc(customerRef);
    if (!customer.exists()) {
      await setDoc(customerRef, {
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
 * Retrieves all services from Firestore.
 */
export const getAllServices = async () => {
  try {
    const servicesSnapshot = await getDocs(collection(firestore, "services"));
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
    const formsSnapshot = await getDocs(
      query(
        collection(firestore, "form-templates"),
        where("services", "array-contains", id)
      )
    );
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
 * Retrieves a customer by ID.
 */
export const getCustomer = async (customerId) => {
  try {
    const customerRef = doc(firestore, "customers", customerId);
    const customerDoc = await getDoc(customerRef);
    return { info: customerDoc.get("info"), id: customerDoc.get("id") };
  } catch (err) {
    log("Error getting customer", err);
    throw err;
  }
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
    const formsSnapshot = await getDocs(
      query(
        collection(firestore, "filled-forms"),
        where("appointment_id", "==", appointmentId)
      )
    );
    return formsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    log("Error getting filled forms for appointment", err);
    throw err;
  }
};

/**
 * Creates a new appointment in the Firestore database.
 */
export const createAppointment = async (appointment) => {
  try {
    // Convert date to Firestore Timestamp if it is a valid date
    if (appointment.date instanceof Date) {
      appointment.date = Timestamp.fromDate(appointment.date);
    } else {
      // If the date is a string, convert it to a Date first
      const parsedDate = new Date(appointment.date);
      if (!isNaN(parsedDate.getTime())) {
        appointment.date = Timestamp.fromDate(parsedDate);
      } else {
        throw new Error("Invalid appointment date");
      }
    }

    // Save the appointment document in Firestore
    await setDoc(doc(firestore, "appointments", appointment.id), appointment);
  } catch (err) {
    console.error("Error creating appointment:", err);
    throw err;
  }
};

/**
 * Updates an appointment with new data.
 */
export const updateAppointment = async (appointmentId, update) => {
  try {
    const appointmentRef = doc(firestore, "appointments", appointmentId);
    await updateDoc(appointmentRef, update);
  } catch (err) {
    log("Error updating appointment", err);
    throw err;
  }
};

/**
 * Retrieves all appointments for a specific client.
 */
export const getAppointmentsForClient = async (clientId) => {
  try {
    const appointmentsSnapshot = await getDocs(
      query(
        collection(firestore, "appointments"),
        where("customer_id", "==", clientId)
      )
    );
    return appointmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    log("Error getting appointments for client", err);
    throw err;
  }
};

/**
 * Retrieves root form templates from the backend server.
 */
export const getRootTemplates = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/forms`);
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
    const response = await axiosInstance.get(
      `${BASE_URL}/artists/${artistId}/forms/${rootTemplateId}/latest`,
      {
        params: {
          services: services.join(","),
        },
      }
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

/**
 * Gets artist information by user ID.
 */
export const getArtist = async (userId) => {
  try {
    const artistDoc = await getDoc(doc(firestore, "users", userId));
    return artistDoc.data();
  } catch (err) {
    log("Error getting artist information", err);
    throw err;
  }
};
export const getServicesForArtistWithId = async (id) => {
  try {
    const artist = await getArtist(id);
    const services = artist.services || [];
    return services;
  } catch (err) {
    console.error("Error getting services for artist", err);
    throw err;
  }
};

/**
 * Creates and saves a filled-out form.
 */
export const createFilledForm = async (form, formId) => {
  try {
    await setDoc(doc(firestore, "filled-forms", formId), form);
  } catch (err) {
    log("Error creating filled form", err);
    throw err;
  }
};

/**
 * Updates the customer info if the customer doesn't already exist.
 */
export const updateCustomerInfo = async (id, info, user) => {
  await createCustomerIfNecessary(id, user);
  const customerRef = doc(firestore, "customers", id);

  const current_datetime = new Date();
  const formatted_date = `${current_datetime.getDate()}-${
    current_datetime.getMonth() + 1
  }-${current_datetime.getFullYear()}`;
  info.date_updated = formatted_date;

  try {
    await updateDoc(customerRef, {
      name: info.client_name,
      info,
    });
  } catch (err) {
    log("Error updating customer info", err);
    throw err;
  }
};

/**
 * Check if the user is logged in.
 */
export const isLoggedIn = () => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      resolve(!!user);
    });
  });
};

/**
 * If the customer doesn't exist, create it.
 */
export const createCustomerIfNecessary = async (id, user) => {
  const customerRef = doc(firestore, "customers", id);
  const customer = await getDoc(customerRef);

  if (!customer.exists()) {
    try {
      await createCustomer(user.email, user.displayName, user.uid);
      return true;
    } catch (error) {
      log("Error creating customer", error);
      return false;
    }
  }
};
/**
 * Gets all the fille out forms for a customer
 * @param customerId The id of the customer to get the filled out forms for
 */
export const getFilledFormsForCustomer = async (customerId) => {
  const filledFormsRef = collection(firestore, "filled-forms");
  const q = query(filledFormsRef, where("client_id", "==", customerId));

  // Execute the query and get the documents
  const querySnapshot = await getDocs(q);

  // Map the documents to an array of form objects
  const filledForms = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    data: doc.data(),
  }));

  return filledForms;
};

/**
 * Retrieves all form templates for the specified service IDs and artist.
 * @param {Array} serviceIds - An array of service IDs to filter by.
 * @param {string} artistId - The ID of the artist to filter forms for.
 * @returns {Promise<Array>} - A promise that resolves to an array of form templates.
 */
export const getAllFormsForServicesFromFirebase = async (
  serviceIds,
  artistId
) => {
  try {
    // Retrieve all root templates from Firestore
    let forms = await getRootTemplates();

    log(`Retrieved all form templates for the service ids: ${serviceIds}`);

    // Filter forms based on the provided service IDs
    forms = filterFormsByServiceId(forms, serviceIds);

    // Get the latest form templates for each root template for the artist
    const latestFormTemplatesPromises = forms.map((f) =>
      getLatestTemplateVersion(f.id, artistId, f.services)
    );

    let latestForms = await Promise.all(latestFormTemplatesPromises);

    // Separate forms using service array versioning
    let formsUsingServiceArrayVersioning = latestForms.filter(
      (f) => f.usesServicesArrayVersioning
    );

    // Further filter these forms by service ID
    formsUsingServiceArrayVersioning = filterFormsByServiceId(
      formsUsingServiceArrayVersioning,
      serviceIds
    );

    // Exclude forms that use service array versioning from the latest forms
    latestForms = latestForms.filter((f) => !f.usesServicesArrayVersioning);

    // Combine the forms together
    latestForms = [...latestForms, ...formsUsingServiceArrayVersioning];

    // Sort forms by the order field in ascending order
    latestForms.sort((a, b) => a.order - b.order);

    console.log(latestForms);
    return latestForms;
  } catch (err) {
    console.error("Error getting forms:", err);
    log("Error getting forms", err);
    throw err;
  }
};

const filterFormsByServiceId = (forms, serviceIds) => {
  return forms.filter((form) =>
    form.services.some((serviceId) => serviceIds.includes(serviceId))
  );
};

export const getAuthToken = () => {
  return localStorage.getItem("idToken");
};

/**
 * Get all the forms that need to be filled out for the list of services provided.
 * @param {number[]} serviceIds - The services that the user will be getting done for this appointment.
 * @param {Array} formTemplates - The available form templates.
 * @returns {Array} - List of form templates for the specified services.
 */
export const getAllFormsForServices = (serviceIds, formTemplates) => {
  if (!formTemplates || formTemplates.length === 0) {
    return [];
  }

  let appointmentFormTemplates = [];

  serviceIds.forEach((id) => {
    formTemplates.forEach((template) => {
      if (
        template.services.includes(id) &&
        !appointmentFormTemplates.includes(template)
      ) {
        appointmentFormTemplates.push(template);
      }
    });
  });

  return appointmentFormTemplates;
};
