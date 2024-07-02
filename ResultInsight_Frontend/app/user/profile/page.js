"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

const Profile = () => {
  const { isLoggedIn, logout, user, setUser } = useAuth(); 
  const [selectedSession, setSelectedSession] = useState(2018);
  const sessions = [2018, 2019, 2020, 2021, 2022];

  useEffect(() => {
    // Update selectedSession to match user.session on component mount
    if (user && user.session) {
      setSelectedSession(user.session); 
    }
  }, [user]); // Run effect when user changes

  const handleSessionChange = (event) => {
    setSelectedSession(parseInt(event.target.value));
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post(`/user/${selectedSession}/update-session/`, {
        session: selectedSession,
      });

      // Update user state correctly
      setUser((prevUser) => ({ ...prevUser, session: selectedSession }));

      Cookies.set("user", JSON.stringify(user));
      alert("Session updated successfully");
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Failed to update session");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <input
          type="text"
          value={user.username}
          readOnly
          className="px-3 py-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email:
        </label>
        <input
          type="email"
          value={user.email}
          readOnly
          className="px-3 py-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Session:
        </label>
        <select
          value={selectedSession}
          onChange={handleSessionChange}
          className="px-3 py-2 border rounded w-full"
        >
          {sessions.map((session) => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Profile;
