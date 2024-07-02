//app/components/Comment.js
import React, { useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance";
import CommentItem from "./CommentItem";

const Comment = ({ postId, updateCommentCount }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(`/post/${postId}/comments/`);

  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId, currentPage]);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(currentPage);
      setComments(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post(`/post/${postId}/comments/`, {
        content: newComment,
      });
      // setCurrentPage("");
      setCurrentPage(`/post/${postId}/comments/`);
      fetchComments();
      updateCommentCount();
      setNewComment("");
    } catch (error) {
      alert("Login To Comment!");
      console.error("Failed to post comment", error);
    }
  };

  const handlePagination = async (url) => {
    setCurrentPage(url);
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          className="w-full p-2 rounded border border-gray-300"
          rows="3"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Post Comment
        </button>
      </form>
      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDeleteComment={updateCommentCount}
              fetchComments={fetchComments} // Pass updateCommentCount as prop
            />
          ))}
        </ul>
      )}
      <div className="flex justify-between mt-4">
        {prevPage && (
          <button
            onClick={() => handlePagination(prevPage)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Previous
          </button>
        )}
        {nextPage && (
          <button
            onClick={() => handlePagination(nextPage)}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Comment;
