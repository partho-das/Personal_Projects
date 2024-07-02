"use client";
// utils/useAuth.js

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(""); // Initialize user state

  useEffect(() => {
    // Check if running in the browser
    if (typeof window !== "undefined") {
      const storedLoggedIn = localStorage.getItem("isLoggedIn");
      if (storedLoggedIn) {
        setIsLoggedIn(true);
        const userCookie = Cookies.get("user");
        if (userCookie) {
          setUser(JSON.parse(userCookie)); // Set user state from cookie
        }
      } else {
        setIsLoggedIn(false);
        setUser(null); // Ensure user state is null when not logged in
      }
    }
  }, []); // Run once on component mount

  const login = () => {
    localStorage.setItem("isLoggedIn", "true"); // Persist login state in localStorage
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie)); // Update user state after login
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // Remove login state from localStorage
    Cookies.remove("user"); // Remove user cookie on logout
    setUser(null); // Clear user state
  };

  const UserSeter = (userCookie) => {
    if (userCookie) {
      setUser(JSON.parse(userCookie)); // Update user state after login
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
