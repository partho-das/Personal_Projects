//app/components/CommentItem.js

import React, { useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance";
import Cookies from "js-cookie";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const CommentItem = ({ comment, onDeleteComment, fetchComments }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.liked_by.length);
  const { isLoggedIn, user } = useAuth();

  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = user;
      if (comment.liked_by.includes(parsedUser.id)) {
        setLiked(true);
      }
    }
  }, [comment.liked_by]);

  const handleLikeUnlike = async () => {
    if (!user) {
      alert("Please log in to like or unlike comments.");
      return;
    }

    try {
      const url = `/comment/${comment.id}/like-unlike/`;
      if (!liked) {
        await axiosInstance.post(url);
        setLikeCount(likeCount + 1);
      } else {
        await axiosInstance.delete(url);
        setLikeCount(likeCount - 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Failed to like/unlike comment", error);
    }
  };

  const handleDeleteComment = async () => {
  
    if (!user) {
      alert("Please log in to delete comments.");
      return;
    }

    try {
      await axiosInstance.delete(`/comment/${comment.id}/`);
      setDeleted(true); // Trigger deletion animation
      onDeleteComment(); // Notify parent component to update comment count
      fetchComments();
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };

  const commentBackgroundColor =
    comment.id % 2 === 0 ? "bg-gray-100" : "bg-gray-200";

  return deleted ? null : (
    <li
      className={`p-4 rounded-lg shadow-md mb-2 ${commentBackgroundColor}`}
      style={{
        transition: "opacity 0.5s ease-out, max-height 0.5s ease-out",
        opacity: 1,
        maxHeight: "100%",
      }}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-800">{comment.content}</span>
        <div className="flex items-center space-x-2">
          {user && comment.user === user.id && (
            <button
              onClick={handleDeleteComment}
              className="text-white-500 bg-red-500 px-3 py-1 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleLikeUnlike}
            className={`px-3 py-1 rounded ${
              liked
                ? "bg-gray-600 text-white hover:bg-green-600"
                : "bg-blue-500 text-white hover:bg-purple-600"
            }`}
          >
            {liked ? "Unlike" : "Like"}
          </button>
          <span className="text-gray-600">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-1">
        <Link
          href={`/user/${comment.user}`}
          className="text-blue-500 hover:underline"
        >
          {comment.username}
        </Link>{" "}
        • {new Date(comment.time).toLocaleString()}
      </p>
    </li>
  );
};

export default CommentItem;
