"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/components/axiosInstance";

export default function FollowingsPage() {
  const [followings, setFollowings] = useState([]); // Initialize as empty array
  const [nextPage, setNextPage] = useState(null); // URL for next page
  const [prevPage, setPrevPage] = useState(null); // URL for previous page

  useEffect(() => {
    fetchFollowings();
  }, []); // Fetch initial data on component mount

  const fetchFollowings = async (url = "/user/following/") => {
    try {
      const response = await axiosInstance.get(url);
      setFollowings(response.data.results); // Update current page data
      setNextPage(response.data.next); // Update next page URL
      setPrevPage(response.data.previous); // Update previous page URL
    } catch (error) {
      console.error("Failed to fetch followings", error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      await axiosInstance.delete(`/user/${userId}/follow-unfollow/`);
      setFollowings((prevFollowings) =>
        prevFollowings.map((user) =>
          user.id === userId ? { ...user, removing: true } : user
        )
      );
      setTimeout(() => {
        setFollowings((prevFollowings) =>
          prevFollowings.filter((user) => user.id !== userId)
        );
      }, 500);
    } catch (error) {
      console.error("Failed to unfollow user", error);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchFollowings(nextPage); // Fetch next page data
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      fetchFollowings(prevPage); // Fetch previous page data
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Following</h1>
      {followings.length === 0 ? (
        <p className="text-gray-800 text-center">You don't follow anyone.</p>
      ) : (
        <div>
          <ul className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {followings.map((following, index) => (
              <li
                key={following.id}
                className={`mb-4 ${
                  index % 2 === 0 ? "bg-blue-100" : "bg-purple-100"
                }`}
                style={{
                  opacity: following.removing ? 0 : 1,
                  maxHeight: following.removing ? 0 : "100px",
                  overflow: "hidden",
                  transition: "opacity 0.5s, max-height 0.5s",
                }}
              >
                <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-gray-800">{following.username}</span>
                  <button
                    className={`px-4 py-2 rounded ${
                      index % 2 === 0
                        ? "bg-purple-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                    onClick={() => unfollowUser(following.id)}
                  >
                    Unfollow
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {prevPage || nextPage ? (
            <div className="flex justify-between">
              {prevPage && (
                <button
                  onClick={handlePrevPage}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Previous
                </button>
              )}
              {nextPage && (
                <button
                  onClick={handleNextPage}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
