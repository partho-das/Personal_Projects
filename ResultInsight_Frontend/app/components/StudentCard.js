// components/StudentCard.js

import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/components/axiosInstance";

const StudentCard = ({ student, onUnfollow }) => {
  const [isFollowing, setIsFollowing] = useState(true); // Assuming student is already followed initially
  const [isUnfollowing, setIsUnfollowing] = useState(false); // State to manage unfollow animation

  const handleUnfollow = async () => {
    setIsUnfollowing(true); // Start animation
    try {
      await axiosInstance.delete(`/user/${student.reg_no}/follow-unfollow/`);
      setTimeout(() => {
        setIsFollowing(false); // Update local state to reflect unfollowed status after animation
        setIsUnfollowing(false); // Reset animation state
        onUnfollow(student.reg_no); // Notify parent component to update following list
      }, 300); // Adjust timing to match CSS transition duration
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div
      className={`border p-4 my-4 rounded-lg shadow-md transition-opacity duration-300 ease-in-out ${
        isUnfollowing ? "opacity-0" : "opacity-100"
      }`}
    >
      <h2 className="text-xl font-semibold">
        <Link href={`/student/${student.reg_no}`} className="hover:underline">
          {student.name}
        </Link>
      </h2>
      <p>Registration No: {student.reg_no}</p>
      <p>Session: {student.session}</p>
      <p>GPA: {student.gpa}</p>
      <div className="mt-4">
        {isFollowing ? (
          <button
            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out ${
              isUnfollowing ? "pointer-events-none" : ""
            }`}
            onClick={handleUnfollow}
            disabled={isUnfollowing}
          >
            {isUnfollowing ? "Unfollowing..." : "Unfollow"}
          </button>
        ) : (
          <p className="text-gray-600">Not following</p>
        )}
      </div>
    </div>
  );
};

export default StudentCard;
