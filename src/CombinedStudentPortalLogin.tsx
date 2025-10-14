// CHQ: Gemini AI generated, CHQ (me) edited

import { useCallback } from "react"; // ADDED: useCallback for the new function

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { getSessionToken } from "@descope/react-sdk"; // CHQ: suggested by Descope AI
import StudentsDisplay from "./components/StudentsDisplay";

import SamplePage from "./components/SamplePage";

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

// --- MOCK External Dependencies & Components ---
// In a real application, these would be imported from external files or libraries.

const BASE_API_URL = import.meta.env.VITE_API_GO_URL;

// Mock implementation of the Teacher Registration function (from FirstApp.tsx)
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

// Mock components
const MockSamplePage = () => (
  <div className="text-center p-8 bg-blue-50 rounded-lg">
    <h2 className="text-xl font-bold text-blue-700">Sample Page Content</h2>
    <p className="text-blue-600 mt-2">This is a generic content page.</p>
  </div>
);
const MockStudentsDisplay = (props) => (
  <div className="text-center p-8 bg-yellow-50 rounded-lg">
    <h2 className="text-xl font-bold text-yellow-700">Student Roster Page</h2>
    <p className="text-yellow-600 mt-2">
      Displaying student data with token:{" "}
      {props.theSessionToken.substring(0, 10)}...
    </p>
  </div>
);
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

const LoginDashboard = (props: { sessionToken: string }) => {
  // const myChoice:string = "NotionForm";
  const myChoice: string = "StudentPortal";
  // const myChoice: string = "NOPE";

  return (
    <>
      {myChoice === "StudentPortal" ? (
        // <FirstApp myUserID={props.userID} />
        <FirstApp mySessionToken={props.sessionToken} />
      ) : (
        <SamplePage />
      )}
    </>
  );
};

interface DescopeUser {
  name?: string; // Assuming 'name' is a property in the user object. Adjust as needed.
  // [key: string]: any; // To allow other potential properties
}
interface LandingPageProps {
  theUser: DescopeUser;
  // theToken: string;
  theHandleLogout: () => void;
}

const DescopeLandingPage = (props: LandingPageProps) => {
  const sessionToken = getSessionToken();

  // CHQ: Gemini AI added the hooks and handleBack callback
  // 2. Initialize the hooks
  const navigate = useNavigate();
  const location = useLocation();

  const isAtLandingPage = location.pathname === "/";

  // Function for the back button
  const handleBack = () => {
    // Navigates to the base path '/'
    navigate("/");
  };
  return (
    <>
      {/* <p>Hello {props.theUser.name}</p> */}
      {/* <p>Hello {props.theUser?.name}</p>{" "} */}
      {/* Using optional chaining in case name is not always present */}
      <div>My Private Component</div>
      {/* <LoginDashboard userID={theTeacherID} /> */}
      <LoginDashboard sessionToken={sessionToken} />
      {/* <FormToMongo /> */}

      {/* CHQ: Gemini AI added Conditionally render the "Back" button */}
      {!isAtLandingPage && <button onClick={handleBack}>Back</button>}
      <button onClick={props.theHandleLogout}>Logout</button>
    </>
  );
};

export default DescopeLandingPage;
// // Main App Component (Wrapping with Router Context)
// const App = () => {
//   const mockUser = { name: "Jane Doe" };
//   const mockLogout = () => {
//     // Using a non-alert message box for display
//     document.getElementById(
//       "message-box"
//     ).innerHTML = `<div class="p-2 bg-red-100 text-red-700 rounded-lg">
//             Logout initiated (Mocked).
//         </div>`;
//     setTimeout(() => {
//       document.getElementById("message-box").innerHTML = "";
//       // Simulate history change to reset to a known state if needed
//       window.history.pushState(null, "", "/");
//     }, 3000);
//   };

//   return (
//     // The entire application must be wrapped in a single Router for hooks to work
//     <div className="min-h-screen bg-indigo-50 p-6 flex items-start justify-center font-sans">
//       <Router>
//         {/* '*' route catches all paths, allowing the inner components to use the same router */}
//         <Routes>
//           <Route
//             path="*"
//             element={
//               <DescopeLandingPage
//                 theUser={mockUser}
//                 theHandleLogout={mockLogout}
//               />
//             }
//           />
//         </Routes>
//       </Router>
//     </div>
//   );
// };

// export default App;
