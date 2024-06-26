// app/user/createPost/page.js
"use client";
import { useState } from "react";
import axiosInstance from "@/components/axiosInstance";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/posts/", { content });
      router.push("/all-posts");
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create Post
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <textarea
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            rows="5"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 mt-4 rounded focus:outline-none focus:shadow-outline"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
