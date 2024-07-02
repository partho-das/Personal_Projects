"use client";

// components/FollowingList.js
import { useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance";
import StudentCard from "@/components/StudentCard";

const FollowingList = () => {
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    const fetchFollowingList = async () => {
      try {
        const response = await axiosInstance.get("/user/following");
        setFollowingList(response.data);
      } catch (error) {
        console.error("Error fetching following list:", error);
      }
    };

    fetchFollowingList();
  }, []);

  const handleUnfollow = (regNo) => {
    setFollowingList((prevList) =>
      prevList.filter((student) => student.reg_no !== regNo)
    );
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Following List</h1>
      {followingList.length > 0 ? (
        followingList.map((student) => (
          <StudentCard
            key={student.reg_no}
            student={student}
            onUnfollow={handleUnfollow}
          />
        ))
      ) : (
        <p className="text-gray-600">No students followed yet.</p>
      )}
    </div>
  );
};

export default FollowingList;
