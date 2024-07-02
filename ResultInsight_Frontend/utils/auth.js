// utils/auth.js
import Cookies from "js-cookie";

import axiosInstance from "@/components/axiosInstance";

export const loginF = async (username, password) => {
  try {
    const response = await axiosInstance.post("login/", {
      username: username,
      password: password,
    });
    // Assuming the response contains access and refresh tokens
    // localStorage.setItem("access", response.data.access);
    // localStorage.setItem("refresh", response.data.refresh);

    Cookies.set("access", response.data.access);
    Cookies.set("refresh", response.data.refresh);
    Cookies.set("user", JSON.stringify(response.data.user));

    // Handle successful login (e.g., redirect, update UI, etc.)
    console.log("Login successful:", response.data);

    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Rethrow error to handle it elsewhere if needed
  }
};

export const registerF = async (email, username, selectedSession, password, confirmation) => {
  try {
    const response = await axiosInstance.post("register/", {
      username: username,
      password: password,
      session: selectedSession,
      email: email,
      confirmation: confirmation,
    });

    // Assuming the response contains access and refresh tokens
    console.log("OKOK");
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    // Handle successful login (e.g., redirect, update UI, etc.)
    console.log("Registration Sucessful:", response.data);

    return response.data; // Return response data if needed
  } catch (error) {
    console.error("Error Registration in:", error);
    throw error; // Rethrow error to handle it elsewhere if needed
  }
};

export const refreshF = async (refresh) => {
  // console.log(refresh);
  try {
    const response = await axiosInstance.post("refresh-token/", {
      refresh: refresh,
    });
    // console.log(response);
    return response.data; // Return response data if needed
  } catch (error) {
    // console.log(error);
    // console.error("Error Registration in:", error);
    // throw error; // Rethrow error to handle it elsewhere if needed
  }
};
