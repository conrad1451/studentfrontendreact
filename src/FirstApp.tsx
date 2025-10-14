// FirstApp.tsx

import SamplePage from "./components/SamplePage";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import StudentsDisplay from "./components/StudentsDisplay";
import TeacherInfo from "./components/TeacherInfo";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

function NavigationButtons() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
      <Button variant="contained" onClick={() => handleNavigate("/orig")}>
        Go to Sample component page
      </Button>
      <Button
        variant="contained"
        onClick={() => handleNavigate("/studentroster")}
      >
        Go to Student Roster
      </Button>

      <Button
        variant="contained"
        onClick={() => handleNavigate("/teacherprofile")}
      >
        Go to Teacher Profile
      </Button>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Main App Component
// ----------------------------------------------------------------------

const FirstApp = (props: { mySessionToken: string }) => {
  console.log("mySessionToken is " + props.mySessionToken);

  return (
    <>
      <Router>
        <Routes>
          {/* 3. Pass the session token down to the NavigationButtons component */}
          <Route path="/" element={<NavigationButtons />} />
          <Route path="/orig" element={<SamplePage />} />
          <Route
            path="/studentroster"
            element={
              // StudentsDisplay needs the session token to use the useStudents hook
              <StudentsDisplay
                theChoice={2} // Assuming this choice maps to the GO API student endpoint
                theSessionToken={props.mySessionToken}
              />
            }
          />
          <Route
            path="/teacherprofile"
            element={<TeacherInfo mySessionToken={props.mySessionToken} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default FirstApp;
