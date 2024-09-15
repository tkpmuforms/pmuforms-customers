// src/pages/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { environment } from "../../../environments/environment";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
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
export { app, auth, firestore, googleProvider, facebookProvider, signInWithEmailAndPassword, signInWithPopup };
