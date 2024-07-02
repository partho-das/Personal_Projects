// app/user/networkfeed/page.js
"use client";
import React from "react";
import Posts from "@/components/Posts";

const NetworkFeedPage = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Network Feeed</h1>
      <Posts postsUrl="/posts/network-feed/" />
    </div>
  );
};

export default NetworkFeedPage;
