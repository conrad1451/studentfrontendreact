// StudentsDisplay.tsx

// import React from "react";
import { useStudents } from "../hooks/useStudents";
import StudentTable from "./StudentTable";
import StudentTableAlt from "./StudentTableAlt";

import { Box, Button, Typography } from "@mui/material"; // Import necessary MUI components
import type { RowPage } from "../utils/dataTypes"; // Import both
import { transformStudentRecordToRowPage } from "../utils/dataTransforms";

// import { UserData } from "../utils/dataTypes";

// Define the prop type for EmptyDatabase for better type safety
interface EmptyDatabaseProps {
  theRefetchOfStudents: () => void;
}

const EmptyDatabase = (props: EmptyDatabaseProps) => {
  return (
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
  );
};

// CHQ: Gemini AI renamed and refactored this.
//      It split a single functional component into a hook and a component
// const StudentsDisplay = (props: { theChoice: number; myToken: string }) => {
// const StudentsDisplay = (props: { theChoice: number; myUserID: string }) => {
const StudentsDisplay = (props: {
  theChoice: number;
  theSessionToken: string;
}) => {
  // const { students, loading, error, refetchStudents } = useStudents(1);

  // const myUserID: UserData = JSON.parse(props.myToken);
  // const myUserID: UserData = JSON.parse(props.myUserID);

  // const { students, loading, error, refetchStudents } = useStudents(
  //   props.theChoice,
  //   myUserID.userId
  // );
  const { students, loading, error, refetchStudents } = useStudents(
    props.theChoice,
    props.theSessionToken
  );
  // console.log("props.myToken");

  // console.log(props.myToken);

  // Set this to `false` to use real data from the API
  const useSampleData = false;

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">Loading students...</Typography>
      </Box>
    );
  }

  // Display error message if there's an error and we're not explicitly using sample data
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

  // Sample data, now explicitly typed as RowPage[] to match StudentTable's expectation
  const studentSampleData: RowPage[] = [
    {
      myID: 101,
      FirstName: "Steven",
      LastName: "Okang",
      Email: "steveokang@gmail.com",
      Major: "Computer Science",
    },
    {
      myID: 102,
      FirstName: "Kwame",
      LastName: "Kingston",
      Email: "kwamekingston@gmail.com",
      Major: "Electrical Engineering",
    },
  ];

  // --- Prepare the data for StudentTable based on 'useSampleData' flag ---
  let dataForTable: RowPage[];
  if (useSampleData) {
    dataForTable = studentSampleData;
  } else {
    // --- THIS IS THE CRITICAL PART: Use the imported transformation function ---
    dataForTable = transformStudentRecordToRowPage(students);
  }
  // --- END DATA PREPARATION ---

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Student Management Dashboard
      </Typography>

      {/* FIXME: add breakpoints here to debug why empty table does not show when there is no data */}
      {/* Show EmptyDatabase component if no error, no real students, AND not using sample data */}
      {!error && dataForTable.length === 0 && !useSampleData ? (
        <EmptyDatabase theRefetchOfStudents={refetchStudents} />
      ) : // Render StudentTable with the prepared data (either transformed real data or sample data)

      props.theChoice === 1 ? (
        <StudentTable
          thePages={dataForTable}
          theToken={props.theSessionToken}
        />
      ) : (
        <StudentTableAlt thePages={dataForTable} />
      )}
    </Box>
  );
};

export default StudentsDisplay;
