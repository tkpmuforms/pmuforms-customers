// src/services/FirebaseService.js
import { firestore, auth } from './firebase';

/**
 * Logs a message to Firestore 'log' collection.
 */
export const log = async (message, error = '') => {
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const artistId = localStorage.getItem('artistId');
  const artistBusinessName = localStorage.getItem('businessName');

  try {
    await firestore.collection('log').add({
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
    console.error('Error logging to server', err);
  }
};

/**
 * Creates a new customer for an artist.
 */
export const createCustomer = async (email, name, id) => {
  try {
    const customerRef = firestore.collection('customers').doc(id);
    const customer = await customerRef.get();
    if (!customer.exists) {
      await customerRef.set({
        email,
        info: {
          client_name: name,
        },
        id,
      });
      log('User added to customers collection successfully');
      return true;
    }
  } catch (err) {
    log('Error creating customer', err);
    throw err;
  }
};

/**
 * Gets all services from Firestore.
 */
export const getAllServices = async () => {
  try {
    const servicesSnapshot = await firestore.collection('services').get();
    return servicesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    log('Error getting all services', err);
    throw err;
  }
};

/**
 * Retrieves all forms for a specific service.
 */
export const getAllFormsForService = async (id) => {
  try {
    const formsSnapshot = await firestore
      .collection('form-templates')
      .where('services', 'array-contains', id)
      .get();

    return formsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.get('title'),
    }));
  } catch (err) {
    log('Error getting forms for service', err);
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
      localStorage.setItem('idToken', idToken);
    } catch (err) {
      log('Error retrieving auth token', err);
    }
  } else {
    console.log('User not authenticated');
  }
};

/**
 * Checks if a user is logged in.
 */
export const isLoggedIn = () => {
  return auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = '/login'; // Redirect to login page
    }
  });
};

/**
 * Logs out the user and clears the local storage.
 */
export const logout = async () => {
  try {
    await auth.signOut();
    localStorage.clear();
  } catch (err) {
    log('Error during logout', err);
  }
};

// You can continue converting other methods similarly...
