// FirstApp.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react"; // ADDED: useCallback for the new function
import SamplePage from "./components/SamplePage";
// import CustomTable from './MyTable'

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import StudentsDisplay from "./components/StudentsDisplay";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

// --- REQUIRED TYPE STUBS ---

// Assuming StudentRecord is the structure of your student data
interface StudentRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  major: string;
  teacher_id: string; // Assuming this is also present
}

// Assuming UseStudentsResult is the return type of your custom hook
interface UseStudentsResult {
  students: StudentRecord[];
  loading: boolean;
  error: string | null;
  refetchStudents: () => void;
}

// Get API base URL from environment variables
// const BASE_API_URL = import.meta.env.VITE_GO_API_URL;
const BASE_API_URL = import.meta.env.VITE_API_GO_URL;

// ----------------------------------------------------------------------
// 1. New Imperative Function to Register Teacher (replaces writetonewtalbe hook)
// ----------------------------------------------------------------------

/**
 * Registers the authenticated user (teacher) in the backend's 'the_real_teachers' table.
 * It uses a POST request and relies on the backend to extract the teacher's ID from the session token.
 *
 * @param sessionToken The Descope session token for authentication.
 */

const registerTeacherInDB = async (sessionToken: string) => {
  if (!BASE_API_URL) {
    console.error("VITE_GO_API_URL environment variable is not set.");
    alert("Error: API URL is not configured.");
    return;
  }

  const apiURL = `${BASE_API_URL}/registerteacher`;

  try {
    const response = await fetch(apiURL, {
      method: "POST", // Changed to POST
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      // Optionally send a minimal body, though the backend relies on the token for the ID
      body: JSON.stringify({}),
    });

    let data = null;

    // Check if the response is successful AND has content (not a 204 No Content)
    // response.json() will throw an error if the body is empty.
    const hasContent =
      response.headers.get("content-length") !== "0" && response.status !== 204;

    if (hasContent) {
      try {
        data = await response.json();
      } catch (e) {
        // This catches cases where the backend sends a successful status
        // but the body is not valid JSON (e.g., plain text or empty)
        console.warn(
          "API call succeeded but failed to parse response body as JSON.",
          e
        );
      }
    }
    if (!response.ok) {
      // Handle non-2xx responses
      const errorMessage =
        data?.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    // Success response
    const successMessage = data?.message || "Teacher registered successfully.";
    console.log("Teacher registration successful:", data);
    alert("Teacher registration processed successfully: " + successMessage);
  } catch (e: any) {
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred.";
    console.error("Failed to register teacher:", errorMessage);
    alert("Failed to register teacher: " + errorMessage);
  }
};

// ----------------------------------------------------------------------
// Navigation Component
// ----------------------------------------------------------------------

// The FirstApp component now passes the session token to NavigationButtons
interface NavigationButtonsProps {
  mySessionToken: string;
}

function NavigationButtons({ mySessionToken }: NavigationButtonsProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Memoize the handler for registering the teacher
  const handleRegisterTeacher = useCallback(() => {
    registerTeacherInDB(mySessionToken);
  }, [mySessionToken]);

  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
      <Button variant="contained" onClick={() => handleNavigate("/orig")}>
        Go to Sample component page
      </Button>
      <Button
        variant="contained"
        onClick={() => handleNavigate("/datafetchergo1")}
      >
        Go to Student Roster
      </Button>
      <Button
        variant="contained"
        // 2. Updated to call the new registration function
        onClick={handleRegisterTeacher}
      >
        Register as a Teacher
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
          <Route
            path="/"
            element={
              <NavigationButtons mySessionToken={props.mySessionToken} />
            }
          />
          <Route path="/orig" element={<SamplePage />} />
          <Route
            path="/datafetchergo1"
            element={
              // StudentsDisplay needs the session token to use the useStudents hook
              <StudentsDisplay
                theChoice={2} // Assuming this choice maps to the GO API student endpoint
                theSessionToken={props.mySessionToken}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default FirstApp;
