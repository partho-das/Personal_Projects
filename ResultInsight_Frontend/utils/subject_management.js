export const numbertoGrade = (grade) => {
  if (grade == 4.0) return "A+";
  else if (grade == 3.75) return "A";
  else if (grade == 3.5) return "A-";
  else if (grade == 3.25) return "B+";
  else if (grade == 3.0) return "B";
  else if (grade == 2.75) return "B-";
  else if (grade == 2.5) return "C+";
  else if (grade == 2.25) return "C";
  else if (grade == 2.0) return "D";
  else if (grade == 0.0) return "F";
  else if (grade == -1.0) return "N/A";

  return "Invalid Grade";
};
