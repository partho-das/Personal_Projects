"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/student/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full p-8 rounded-lg shadow-md bg-blue-50">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          ResultInsight
        </h1>
        <p className="text-gray-700 text-center mb-6">
          Explore and analyze academic results with ease.
        </p>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter Registration Number"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
        >
          Search
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Key Features:
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Comprehensive Results (2018-2021)</li>
          <li>Subject-wise Performance Analysis</li>
          <li>Rankings and Comparisons</li>
          <li>Session-wise Results Breakdown</li>
        </ul>
      </div>
    </div>
  );
}
