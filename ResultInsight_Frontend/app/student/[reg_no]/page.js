"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/components/axiosInstance";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { numbertoGrade, gradeToNumber } from "/utils/subject_management";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

// ResultSheet Component
const ResultSheet = ({ semester, semKey, onOverallGpaChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [subjectData, setSubjectData] = useState({});
  const [editedGrades, setEditedGrades] = useState({});
  const [semesterData, setSemesterData] = useState(semester);

  useEffect(() => {
    const fetchSubjectData = async () => {
      const data = {};
      try {
        const subjectFetchPromises = semester.subjects
          .filter((subject) => !subjectData[subject.code])
          .map((subject) => axiosInstance.get(`/subject/${subject.code}`));

        const responses = await Promise.all(subjectFetchPromises);

        responses.forEach((response) => {
          if (response.status === 200) {
            data[response.data.code] = response.data;
          } else {
            console.error(
              `Error fetching subject data for code: ${subject.code}`
            );
          }
        });

        setSubjectData((prevData) => ({ ...prevData, ...data }));
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    if (semester && semester.subjects) {
      fetchSubjectData();
    }
  }, [semester, semKey]);

  useEffect(() => {
    if (Object.keys(editedGrades).length > 0) {
      calculateCGPA();
    }
  }, [editedGrades]);

  const calculateCGPA = () => {
    let newTotalWeightedSum = 0;
    let newTotalCredit = 0;

    semesterData.subjects.forEach((subject) => {
      const editedGrade = editedGrades[subject.code];
      const grade = editedGrade !== undefined ? editedGrade : subject.grade;

      newTotalWeightedSum += grade * subject.credit;
      newTotalCredit += subject.credit;
    });

    const newCgpa = newTotalWeightedSum / newTotalCredit;

    setSemesterData((prevSemesterData) => {
      const updatedSemesterData = {
        ...prevSemesterData,
        cgpa: newCgpa,
        total_weightedsum: newTotalWeightedSum,
      };

      if (typeof onOverallGpaChange === "function") {
        onOverallGpaChange(newCgpa, semKey); // Pass the new CGPA and semester key
      }
      return updatedSemesterData;
    });
  };

  const handleGradeChange = (subjectCode, newGrade) => {
    setEditedGrades((prevGrades) => ({
      ...prevGrades,
      [subjectCode]: newGrade,
    }));
  };

  const getGradeColor = (average, grade) => {
    if (grade <= 0) return "text-red-600";
    if (grade > average) return "text-green-600";
    if (grade === average) return "text-purple-600";
    if (grade < average) return "text-yellow-600";
    return ""; // Default color if no condition matches
  };

  return (
    <div className="mb-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-bold">
          Semester {semKey} - CGPA: {semesterData?.cgpa?.toFixed(2) || "N/A"}
        </span>
        <span
          className={`transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          {/* Use Font Awesome icon for expanding/collapsing */}
          <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
        </span>
      </div>
      {expanded && (
        <div className="mt-2">
          <div className="mb-4 bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-600">
              Weighted Sum (
              {semesterData?.total_weightedsum?.toFixed(2) || "N/A"} ) / Total
              Credit ({semesterData?.total_credit?.toFixed(2) || "N/A"}) = CGPA
              ({semesterData?.cgpa?.toFixed(2) || "N/A"})
            </p>
          </div>
          <ul className="mt-4 space-y-2">
            {semesterData?.subjects?.map((subject) => (
              <li
                key={subject.code}
                className="flex flex-col bg-white p-4 rounded shadow-md relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center w-2/3">
                    <span className="text-blue-500 font-semibold truncate">
                      {subject.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-700 w-1/3 text-right">
                    Code: {subject.code}
                  </span>
                </div>
                <span className="font-semibold text--700">
                  Credit: {subject.credit}
                </span>
                <div className="flex justify-between items-center">
                  <span
                    className={`font-semibold ${getGradeColor(
                      subjectData[subject.code]?.average,
                      editedGrades[subject.code] || subject.grade
                    )}`}
                  >
                    Grade:{" "}
                    {numbertoGrade(editedGrades[subject.code] || subject.grade)}{" "}
                    ({(editedGrades[subject.code] || subject.grade).toFixed(2)})
                  </span>
                  {/* Grade Edit Dropdown */}
                  <div className="relative inline-block w-28">
                    <label
                      htmlFor="grade-dropdown"
                      className="text-orange-500 font-semibold mr-2"
                    >
                      Recalculate +/-
                    </label>
                    <select
                      id="grade-dropdown"
                      className="w-full px-3 py-2 text-center bg-orange-300 font-semibold rounded-md border border-gray-300 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                      value={editedGrades[subject.code] || subject.grade}
                      onChange={(e) =>
                        handleGradeChange(
                          subject.code,
                          parseFloat(e.target.value)
                        )
                      }
                    >
                      {[4.0, 3.75, 3.5, 3.25, 3.0, 2.75, 2.5, 2.25, 2.0].map(
                        (grade) => (
                          <option key={grade} value={grade}>
                            {numbertoGrade(grade)}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                {subjectData[subject.code] && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">
                        Average Grade:{" "}
                        {numbertoGrade(subjectData[subject.code].average)} (
                        {subjectData[subject.code].average.toFixed(2)})
                      </span>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

//

function Page() {
  const { reg_no } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { isLoggedIn } = useAuth();
  const [overallGpa, setOverallGpa] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`student/${reg_no}`);
        setUserData(response.data);
        setOverallGpa(response.data.gpa);

        if (isLoggedIn) {
          const profileResponse = await axiosInstance.get(`user/profile/`);
          const mydata = profileResponse.data;
          if (
            mydata &&
            mydata.following &&
            mydata.following.includes(response.data.id)
          ) {
            setIsFollowing(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (reg_no) {
      fetchData();
    }
  }, [reg_no, isLoggedIn]);

  const handleFollowUnfollow = async () => {
    try {
      const endpoint = `/user/${reg_no}/follow-unfollow/`;
      const method = isFollowing ? "DELETE" : "POST";

      await axiosInstance.request({
        url: endpoint,
        method: method,
      });

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  if (!userData) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  const reversedSemesterKeys = Object.keys(userData.semester_data).reverse();

  // Calculate overall GPA based on all semesters
  const calculateOverallGPA = (newCgpa, changedSemKey) => {
    let totalGpaPoints = 0;
    let totalSemesters = 0;
    for (const semesterKey in userData.semester_data) {
      const sem = userData.semester_data[semesterKey];
      if (sem && sem.cgpa) {
        if (semesterKey !== changedSemKey) {
          totalGpaPoints += sem.cgpa;
        } else {
          totalGpaPoints += newCgpa;
        }
        totalSemesters++;
      }
    }
    return totalSemesters > 0 ? totalGpaPoints / totalSemesters : 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        {userData.name}'s Result
        {isLoggedIn ? (
          <button
            className={`ml-8 px-3 py-1 rounded-md text-xl ${
              isFollowing ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
            onClick={handleFollowUnfollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        ) : (
          ""
        )}
      </h1>

      {/* Current GPA with Styling */}
      <div className="mb-8 flex items-center">
        <span className="text-lg font-semibold mr-2">
          Registration No: {userData ? userData.reg_no : "N/A"}
        </span>
        <span className="text-2xl font-bold text-blue-600 rounded-md px-3 py-1 bg-blue-100"></span>
      </div>
      <div className="mb-8 flex items-center">
        <span className="text-lg font-semibold mr-2">Current GPA:</span>
        <span className="text-2xl font-bold text-blue-600 rounded-md px-3 py-1 bg-blue-100">
          {overallGpa ? overallGpa.toFixed(2) : "N/A"}
        </span>
      </div>

      <div className="divide-y divide-gray-300">
        {reversedSemesterKeys.map((semesterKey) => {
          const semester = userData.semester_data[semesterKey];
          if (!semester) return null;

          return (
            <div key={semesterKey} className="py-4">
              <ResultSheet
                semester={semester}
                semKey={semesterKey}
                onOverallGpaChange={(newCgpa, semKey) => {
                  // Update the overall GPA when a semester's CGPA changes
                  setOverallGpa(calculateOverallGPA(newCgpa, semKey));
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Page;
