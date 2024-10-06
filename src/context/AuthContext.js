// src/context/AuthContext.js
import React, { useContext, useEffect, useState, createContext } from "react";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitor Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login: (email, password) =>
      auth.signInWithEmailAndPassword(email, password),
    logout: () => auth.signOut(),
    signup: (email, password) =>
      auth.createUserWithEmailAndPassword(email, password),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
