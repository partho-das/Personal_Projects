"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance"; // Replace with your actual path
import { numbertoGrade, gradeToNumber } from "/utils/subject_management"; // Replace with your actual path

const ResultSheet = ({ semester, semKey, onOverallGpaChange }) => {
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
        onOverallGpaChange(newCgpa); // Notify parent component
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
    <>
      <h2 className="text-2xl font-semibold mb-4">
        Semester {semKey !== undefined ? semKey : "N/A"}
      </h2>
      <div className="mb-4">
        <p className="text-lg">
          <span className="font-semibold">CGPA:</span>{" "}
          {semesterData?.cgpa?.toFixed(2) || "N/A"}
        </p>
        <p className="text-lg flex justify-between">
          <span className="font-semibold">
            Weighted Sum ({semesterData?.total_weightedsum?.toFixed(2) || "N/A"}{" "}
            ) / Total Credit ({semesterData?.total_credit?.toFixed(2) || "N/A"})
            = CGPA ({semesterData?.cgpa?.toFixed(2) || "N/A"})
          </span>
        </p>
      </div>
      <ul className="mt-4 space-y-2">
        {semesterData?.subjects?.map((subject) => (
          <li
            key={subject.code}
            className="flex flex-col bg-white p-4 rounded shadow-md relative"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-500 font-semibold w-2/3 truncate">
                {subject.name}
              </span>
              <span className="font-semibold text-gray-700 w-1/3 text-right">
                Code: {subject.code}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`font-semibold ${getGradeColor(
                  subjectData[subject.code]?.average,
                  editedGrades[subject.code] || subject.grade
                )}`}
              >
                Grade:{" "}
                {numbertoGrade(editedGrades[subject.code] || subject.grade)} (
                {(editedGrades[subject.code] || subject.grade).toFixed(2)})
              </span>
              <span className="font-semibold text-gray-700">
                Credit: {subject.credit}
              </span>
              {/* Grade Edit Dropdown */}
              <select
                className="absolute top-1/2 right-4 -translate-y-1/2"
                value={editedGrades[subject.code] || subject.grade}
                onChange={(e) =>
                  handleGradeChange(subject.code, parseFloat(e.target.value))
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
    </>
  );
};

export default ResultSheet;
