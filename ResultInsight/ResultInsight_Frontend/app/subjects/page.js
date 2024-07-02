"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/components/axiosInstance";
import { numbertoGrade } from "utils/subject_management";

export default function SubjectsPage() {
  const [data, setData] = useState({});
  const [openSemester, setOpenSemester] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        const response = await axiosInstance.get("subjects/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching (success or failure)
      }
    };

    fetchData();
  }, []);

  const toggleSemester = (semester) => {
    setOpenSemester(openSemester === semester ? null : semester);
  };

  const getTotalCredits = (semester) => {
    return data[semester].reduce((total, subject) => total + subject.credit, 0);
  };

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Subjects by Semester
      </h1>
      <div className="w-full max-w-4xl">
        {isLoading ? ( // Show loading text
          <div className="text-center mt-10">
            <p>Loading subjects...</p>
          </div>
        ) : (
          Object.keys(data).map((semester) => (
            <div
              key={semester}
              className="mb-4 rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full font-semibold flex justify-between items-center bg-blue-500 text-white p-4 text-left transition duration-300 ease-in-out hover:bg-blue-600"
                onClick={() => toggleSemester(semester)}
              >
                <span>Semester {semester}</span>
                <svg
                  className={`w-6 h-6 transition-transform transform ${
                    openSemester === semester ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openSemester === semester && (
                <div className="mt-2 p-4 bg-white">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                      Total Credits: {getTotalCredits(semester)}
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {data[semester].map((subject) => (
                      <li
                        key={subject.id}
                        className="border-b border-gray-200 pb-4"
                      >
                        <h3 className="text-lg font-medium text-gray-900">
                          {subject.name}
                        </h3>
                        <p className="text-gray-600">
                          <span className="font-semibold">Code:</span>{" "}
                          {subject.code}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Credit:</span>{" "}
                          {subject.credit}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Average:</span>{" "}
                          <span className="font-bold">
                            {numbertoGrade(subject.average)}
                          </span>{" "}
                          [{subject.average}]
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">A+ Count:</span>{" "}
                          {subject.aplus}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">
                            Number of Failures:
                          </span>{" "}
                          {subject.failed}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
