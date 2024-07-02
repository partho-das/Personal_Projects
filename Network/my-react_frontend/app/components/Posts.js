"use client";
// components/Posts.js
import React, { useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance";
import PostItem from "@/components/PostItem"; // Importing PostItem component

const Posts = ({ postsUrl }) => {
  const [posts, setPosts] = useState([]); // Initialize posts as an empty array
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(postsUrl);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(currentPage);
      setPosts(response.data.results); // Assuming response.data.results contains the array of posts
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [postsUrl, currentPage]);

  const handleNextPage = async () => {
    if (nextPage) {
      setCurrentPage(nextPage);
    }
  };

  const handlePrevPage = async () => {
    if (prevPage) {
      setCurrentPage(prevPage);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-4">
      {posts.length > 0 ? ( // Check if posts array is not empty
        posts.map((post) => (
          <PostItem key={post.id} post={post} fetchPosts={fetchPosts} />
        ))
      ) : (
        <p>No posts found.</p> // Display message if no posts are available
      )}
      <div className="flex justify-between mt-4">
        {prevPage && (
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Previous
          </button>
        )}
        {nextPage && (
          <button
            onClick={handleNextPage}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Posts;
