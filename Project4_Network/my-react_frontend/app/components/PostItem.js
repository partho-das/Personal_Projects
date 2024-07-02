// app/components/PostItem.js
"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance";
import Link from "next/link";
import Comment from "@/components/Comment";
import { useAuth } from "@/context/AuthContext";

const PostItem = ({ post, fetchPosts, index }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.liked_by.length);
  const [deleted, setDeleted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (user && post.liked_by.includes(user.id)) {
      setLiked(true);
    }
    updateCommentCount();
  }, [post.liked_by, user]);

  const handleLikeUnlike = async () => {
    if (!user) {
      alert("Please log in to like or unlike posts.");
      return;
    }

    try {
      const url = `/post/${post.id}/like-unlike/`;
      if (!liked) {
        await axiosInstance.post(url);
        setLikeCount(likeCount + 1);
      } else {
        await axiosInstance.delete(url);
        setLikeCount(likeCount - 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Failed to like/unlike post", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axiosInstance.delete(`/post/${post.id}/`);
      setDeleted(true);
      fetchPosts(); // Uncomment if you need to refetch posts after deletion
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const updateCommentCount = async () => {
    try {
      const response = await axiosInstance.get(`/post/${post.id}/comments`);
      setCommentCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  if (deleted) {
    return null;
  }

  return (
    <div
      className={`p-4 rounded-lg shadow-md mb-4 ${
        post.id % 2 === 0 ? "bg-purple-100" : "bg-blue-100"
      }`}
    >
      <div className="flex justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Link
            href={`/user/${post.user}`}
            className="text-blue-500 hover:underline"
          >
            {post.username}
          </Link>
          <span className="text-gray-600">
            {new Date(post.time).toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-gray-800 mb-4">{post.content}</p>
      <div className="flex items-center justify-start">
        <button
          onClick={handleLikeUnlike}
          className={`px-4 py-2 rounded ${
            liked
              ? "bg-gray-600 text-white hover:bg-green-600"
              : "bg-blue-500 text-white hover:bg-purple-600"
          }`}
        >
          {liked ? "Unlike" : "Like"}
        </button>
        <span className="text-gray-600 ml-2">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
        <button
          onClick={toggleComments}
          className="ml-4 px-4 py-2 rounded bg-yellow-300 text-gray-800 hover:bg-gray-400"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
        <span className="text-gray-600 ml-2">
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </span>
        {user && post.user === user.id && (
          <button
            onClick={handleDeletePost}
            className="ml-4 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700"
          >
            Delete Post
          </button>
        )}
      </div>
      {showComments && (
        <Comment postId={post.id} updateCommentCount={updateCommentCount} />
      )}
    </div>
  );
};

export default PostItem;
