// app/all-posts/page.js
"use client";
import React from "react";
import Posts from "@/components/Posts"; // Import the Posts component

const AllPosts = () => {
  const postsUrl = "/posts/";

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>
      <Posts postsUrl={postsUrl} /> {/* Use the Posts component */}
    </div>
  );
};

export default AllPosts;
