// File: src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
// --- 1. Import the new deleteAccountAPI function ---
import { loginAPI, signupAPI, deleteAccountAPI } from '../DataPack/Data'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Persist user session (simple localStorage example)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // const login = ...

  const signup = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const newUser = await signupAPI(userData);
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setLoading(false);
      return newUser;
    } catch (err) {
      setError(err.message || "Failed to sign up.");
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // Potentially clear other sensitive context data on logout
  };

  // --- 2. Create the new deleteAccount function ---
  const deleteAccount = async () => {
    if (!currentUser) {
      throw new Error("No user is currently logged in.");
    }
    
    setError(null);
    setLoading(true);
    try {
      await deleteAccountAPI(currentUser._id);
      // After successful deletion from the "database", log the user out.
      logout(); 
      // No need to setLoading(false) here because logout() will trigger a re-render
      // and the user will be redirected.
    } catch (err) {
       setError(err.message || "Failed to delete account.");
       setLoading(false);
       throw err;
    }
  };


  const value = {
    currentUser,
    loading,
    error,
    // login,
    signup,
    logout,
    deleteAccount, // --- 3. Expose the new function through the context ---
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);