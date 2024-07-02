// app/user/profile/page.js
"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/components/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import Posts from "@/components/Posts"; // Import the Posts component
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const { isLoggedIn } = useAuth();

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/user/profile/");
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-gradient-to-br from-purple-200 to-blue-200 shadow-md rounded-lg p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Profile</h1>
        <div className="mb-4">
          <p className="text-purple-800 text-md font-bold mb-1">
            Username:&nbsp;&nbsp;{profile.username}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-blue-800 text-md font-bold mb-1">
            Email:&nbsp;&nbsp;{profile.email}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-green-800 text-md font-bold mb-1">
            <Link href={"/user/followings"}>
              <span className="text-blue-500 hover:underline cursor-pointer">
                Following:&nbsp;&nbsp;
              </span>
            </Link>
            {profile.following.length}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Posts</h2>
        <Posts postsUrl="/posts/?user-only=true" />{" "}
        {/* Use the Posts component */}
      </div>
    </div>
  );
}
