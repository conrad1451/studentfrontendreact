// StudentsDisplay.tsx

import React from "react";
import { useStudents } from "../hooks/useStudents";
import StudentTable from "./StudentTable";

import { Box, Button, Typography } from "@mui/material"; // Import necessary MUI components

// CHQ: Gemini AI renamed and refactored this.
//      It split a single functional component into a hook and a component
const StudentsDisplay: React.FC = () => {
  const { students, loading, error, refetchStudents } = useStudents();

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Loading students...</Typography>
      </Box>
    );
  }

  if (error) {
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Student Management Dashboard
      </Typography>

      {students.length === 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            No students found. Add some from your database or via a POST
            request.
          </Typography>
          <Button variant="contained" onClick={refetchStudents} sx={{ mt: 2 }}>
            Refresh Students
          </Button>
        </Box>
      ) : (
        // Render StudentTable with the fetched data
        <StudentTable thePages={students} />
      )}
    </Box>
  );
};

export default StudentsDisplay;
