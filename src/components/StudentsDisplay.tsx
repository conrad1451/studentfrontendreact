// StudentsDisplay.tsx

import React from "react";
import { useStudents } from "../hooks/useStudents";
import StudentTable from "./StudentTable";

import { Box, Button, Typography } from "@mui/material"; // Import necessary MUI components

const EmptyDatabase = (props: { theRefetchOfStudents: () => void }) => {
  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">
          No students found. Add some from your database or via a POST request.
        </Typography>
        <Button
          variant="contained"
          onClick={props.theRefetchOfStudents}
          sx={{ mt: 2 }}
        >
          Refresh Students
        </Button>
      </Box>
    </>
  );
};

// CHQ: Gemini AI renamed and refactored this.
//      It split a single functional component into a hook and a component
const StudentsDisplay: React.FC = () => {
  const { students, loading, error, refetchStudents } = useStudents();

  const useSampleData = true;

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Loading students...</Typography>
      </Box>
    );
  }

  if (error && !useSampleData) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" color="error">
          Error: {error}
        </Typography>
        <Button variant="contained" onClick={refetchStudents} sx={{ mt: 2 }}>
          Retry Fetch
        </Button>
      </Box>
    );
  }

  const studentSampleData = [
    {
      id: 101,
      FirstName: "Steven",
      LastName: "Okang",
      Email: "steveokang@gmail.com",
      Major: "Computer Science",
    },
    {
      id: 102,
      FirstName: "Kwame",
      LastName: "Kingston",
      Email: "kwamekingston@gmail.com",
      Major: "Electrical Engineering",
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Student Management Dashboard
      </Typography>

      {!error && students.length === 0 ? (
        <EmptyDatabase theRefetchOfStudents={refetchStudents} />
      ) : // Render StudentTable with the fetched data

      useSampleData ? (
        <StudentTable thePages={studentSampleData} />
      ) : (
        <StudentTable thePages={students} />
      )}
    </Box>
  );
};

export default StudentsDisplay;
