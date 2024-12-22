import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, signInWithEmailAndPassword } from "../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    const userCredential = signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  };

  const logout = () => {
    auth.signOut();
    localStorage.clear();
  };

  const signup = (email, password) =>
    auth.createUserWithEmailAndPassword(email, password);

  const value = {
    currentUser,
    login,
    logout,
    signup,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
