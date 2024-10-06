// src/pages/firebase/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { environment } from "../../../environments/environment";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBi-mI94whRK_BsInEM-FNE_gttCiBKE6A",
  authDomain: "pmu-beauty-forms.firebaseapp.com",
  databaseURL: "https://pmu-beauty-forms.firebaseio.com",
  projectId: "pmu-beauty-forms",
  storageBucket: "pmu-beauty-forms.appspot.com",
  messagingSenderId: "265429654619",
  appId: "1:265429654619:web:d63b84351986c62206b37e",
  measurementId: "G-JJMKD3JM75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const firestore = getFirestore(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export initialized services and providers
export {
  app,
  auth,
  firestore,
  googleProvider,
  facebookProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
};
