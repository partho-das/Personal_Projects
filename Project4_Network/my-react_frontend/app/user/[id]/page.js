// app/user/[id]/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/components/axiosInstance";
import Cookies from "js-cookie";
import Post from "@/components/PostItem";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fetchPosts = async (url = `post/user/${id}/`) => {
    try {
      const response = await axiosInstance.get(url);
      setPosts(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to fetch user posts", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/user/${id}/`);
        setUser(response.data);

        const userCookie = Cookies.get("user");
        if (userCookie) {
          const parsedUser = JSON.parse(userCookie);
          setLoginUser(parsedUser);
          setIsFollowing(response.data.followers.includes(parsedUser.id));
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    if (id) {
      fetchUser();
      fetchPosts();
    }
  }, [id]);

  const handleFollowUnfollow = async () => {
    if (!loginUser) {
      alert("Please log in to follow or unfollow users.");
      return;
    }

    try {
      const url = `/user/${user.id}/follow-unfollow/`;
      if (!isFollowing) {
        await axiosInstance.post(url);
        setIsFollowing(true);
      } else {
        await axiosInstance.delete(url);
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Failed to follow/unfollow user", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-4 text-center">
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600">Email: {user.email}</p>
        </div>
        {!loginUser || loginUser.id === user.id ? null : (
          <button
            onClick={handleFollowUnfollow}
            className={`px-4 py-2 rounded ${
              isFollowing ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-center">No posts found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        )}
        <div className="flex justify-between mt-4">
          {prevPage && (
            <button
              onClick={() => fetchPosts(prevPage)}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Previous
            </button>
          )}
          {nextPage && (
            <button
              onClick={() => fetchPosts(nextPage)}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
