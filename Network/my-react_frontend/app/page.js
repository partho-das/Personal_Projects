"use client";

import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import axiosInstance from "./components/axiosInstance";

export default function Home() {
  const { isLoggedIn, logout } = useAuth();
  // logout();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          {/* <button onClick={refreshtoken}>(refresh)</button> */}
          Welcome to My Social Media Site!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Connect with friends, share your moments, and stay updated with what's
          happening around you.
        </p>
        {!isLoggedIn ? (
          <div className="flex space-x-4 mb-8 justify-center">
            <a
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Register
            </a>
          </div>
        ) : (
          ""
        )}
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Features
          </h2>
          <ul className="text-left list-disc list-inside space-y-2">
            <li className="text-gray-700">Create and share posts</li>
            <li className="text-gray-700">
              Follow other users and see their posts
            </li>
            <li className="text-gray-700">Like and comment on posts</li>
            <li className="text-gray-700">Personalized profile page</li>
            <li className="text-gray-700">Real-time notifications</li>
            <li className="text-gray-700">And much more!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
