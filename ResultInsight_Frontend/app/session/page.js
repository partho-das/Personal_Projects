"use client";
import Link from "next/link";
import React from "react";

export default function Page() {
  const sessions = [2018, 2019, 2020, 2021, 2022];

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 ">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
        Explore Rankings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {sessions.map((session) => (
          <Link
            key={session}
            href={`ranking/${session}`}
            className="transform hover:scale-105 transition duration-300 ease-in-out bg-white rounded-lg shadow-lg overflow-hidden group"
          >
            <div className="py-6 px-8 bg-gradient-to-r from-blue-400 to-green-500 group-hover:from-purple-500 group-hover:to-pink-500 text-white text-center font-bold text-xl">
              {session}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
