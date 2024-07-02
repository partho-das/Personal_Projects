// app/login/page.js
"use client";
import { useState } from "react";
import { loginF, refreshF } from "utils/auth"; // Adjust the path based on your project structure
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, logout } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page

    try {
      const response = await loginF(username, password);
      login(); // Update the auth context to indicate the user is logged in
      router.push("/"); // Redirect to the protected dashboard
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("Invalid username or password.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login Page
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="block w-full px-3 py-2 mt-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </div>
  );
}
