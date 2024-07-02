// @/conponents/axionsInstance.js

import axios from "axios";
import Cookies from "js-cookie";
import Router from "next/router"; // Import Router from Next.js for client-side routing

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh");
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/refresh-token/",
            {
              refresh: refreshToken,
            }
          );
          const { access } = response.data;
          Cookies.set("access", access);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Failed to refresh token", err);
          // Redirect to login page here
          Router.replace("/login"); // Assuming /login is your login page route in Next.js
          return Promise.reject(err); // Reject the promise to stop further processing
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
