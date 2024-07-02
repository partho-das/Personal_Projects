"use client";

import { useRouter } from "next/navigation";
import axiosInstance from "@/components/axiosInstance"; // Adjust the path as per your project structure
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const RankingPage = () => {
  const [session, setSession] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRankings = async (session, page) => {
    try {
      const response = await axiosInstance.get(`/${session}/students/`, {
        params: { page },
      });
      setStudents(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rankings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Extract session from the pathname
    const pathname = window.location.pathname;
    const sessionParam = pathname.split("/")[2]; // Assuming session is part of the URL structure
    setSession(sessionParam);

    // Extract page from the query string
    const searchParams = new URLSearchParams(window.location.search);
    const pageParam = parseInt(searchParams.get("page")) || 1;
    setPage(pageParam);
  }, []);

  useEffect(() => {
    if (session) {
      fetchRankings(session, page);
    }
  }, [session, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Update the URL query parameter without reloading the page
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage);
    const newUrl = `${currentPath}?${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    // Fetch data for the new page
    fetchRankings(session, newPage);
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center mt-4">Session parameter missing...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Ranking Page - Session {session}
      </h1>
      {students.length === 0 ? (
        <div className="text-center mt-4">
          This session has no exam results.
        </div>
      ) : (
        <ul className="divide-y divide-gray-300">
          {students.map((student, index) => (
            <li
              key={student.reg_no}
              className="py-4 bg-white shadow-md rounded-lg mb-4"
            >
              <div className="flex items-center mb-2 px-4 py-2 bg-gray-100 rounded-t-lg">
                <Link
                  href={`/student/${student.reg_no}`}
                  className="text-blue-500 hover:underline flex-grow font-semibold"
                >
                  {student.name}
                </Link>
                <span className="font-bold text-green-500 ml-2">
                  Rank: {index + 1 + (page - 1) * 10}
                </span>
              </div>
              <div className="px-4 py-2">
                <h2 className="text-lg font-semibold">
                  Registration No: {student.reg_no}
                </h2>
              </div>
              <div className="px-4 py-2">
                <h2 className="text-lg font-semibold">
                  Current GPA: {student.gpa.toFixed(2)}
                </h2>
              </div>
              <div className="px-4 py-2">
                <h2 className="text-lg font-semibold">Semester-wise GPA</h2>
                <ul className="mt-2">
                  {Object.keys(student.semester_data).map((semesterKey) => {
                    const semester = student.semester_data[semesterKey];
                    if (semester) {
                      return (
                        <li key={semesterKey} className="mb-2">
                          <span className="font-semibold">
                            Semester {semesterKey}:{" "}
                          </span>
                          <span>{semester.cgpa.toFixed(2)}</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex justify-center">
        {page > 1 && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Previous
          </button>
        )}
        {Array.from(
          { length: totalPages > 2 ? 2 : totalPages },
          (_, index) => index + 1
        ).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`mx-1 ${
              pageNum === page
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            } font-bold py-2 px-2 rounded`}
          >
            {pageNum}
          </button>
        ))}
        {totalPages > 4 && <span className="mx-1">...</span>}
        {totalPages > 3 && (
          <button
            onClick={() => handlePageChange(totalPages - 1)}
            className={`mx-1 ${
              totalPages - 1 === page
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            } font-bold py-2 px-2 rounded`}
          >
            {totalPages - 1}
          </button>
        )}
        {totalPages > 2 && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`mx-1 ${
              totalPages === page
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            } font-bold py-2 px-2 rounded`}
          >
            {totalPages}
          </button>
        )}
        {page < totalPages && (
          <button
            onClick={() => handlePageChange(page + 1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-2 rounded-r"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
