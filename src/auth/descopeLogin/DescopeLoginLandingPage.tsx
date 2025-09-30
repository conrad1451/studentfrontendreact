// DescopeLoginLandingPage.tsx

import LoginDashboard from "../../components/accountAccessPages/LoginDashboard";
import { getSessionToken } from "@descope/react-sdk"; // CHQ: suggested by Descope AI

import { useEffect } from "react";

// CHQ: Gemini AI updated user interface
// interface DescopeUser {
//   name?: string; // Assuming 'name' is a property in the user object. Adjust as needed.
//   // [key: string]: any; // To allow other potential properties
// }
// Update DescopeUser to include all properties needed by the registration function
interface DescopeUser {
  name?: string;
  loginId?: string; // <-- Added required property
  email?: string; // <-- Added required property
  // [key: string]: any;
}
interface LandingPageProps {
  theUser: DescopeUser;
  // theToken: string;
  theHandleLogout: () => void;
}

// CHQ: Gemini AI added the function
// --- New Function to Register Teacher on Backend ---
const registerTeacherOnBackend = async () => {
  // const registerTeacherOnBackend = async (user: DescopeUser) => {
  const sessionToken = getSessionToken(); // Get the current session token

  // 1. REQUIRE ONLY the sessionToken
  if (!sessionToken) {
    console.error("Missing token for backend registration. Skipping.");
    return;
  }

  // All logic to calculate firstName, lastName, and create backendData is removed,
  // as the backend only needs the TeacherID from the secure session token.

  try {
    const BASE_URL =
      import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCALHOST;

    const response = await fetch(`${BASE_URL}/api/registerteacher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`, // Send the session token for validation
      },
      // NOTE: The body is intentionally omitted or sent as an empty object ({})
      // since the backend only relies on the token in the header.
      // If you must send a body (e.g., due to strict firewall rules), send an empty object:
      // body: JSON.stringify({}),
    });

    if (response.ok) {
      console.log("Teacher successfully registered/checked on backend.");
    } else {
      const errorText = await response.text();
      console.error(
        `Backend registration failed: ${response.status} - ${errorText}`
      );
    }
  } catch (error) {
    console.error(
      "Error connecting to backend for teacher registration:",
      error
    );
  }
};
// ---------------------------------------------------

const DescopeLandingPage = (props: LandingPageProps) => {
  const sessionToken = getSessionToken();

  // Call the function once when the component mounts
  useEffect(() => {
    // SIMPLIFIED CHECK: Only check if the user object exists, not if specific fields exist
    if (props.theUser) {
      // registerTeacherOnBackend(props.theUser);
      registerTeacherOnBackend();
    } else {
      console.warn(
        "User object incomplete. Skipping teacher registration on component mount."
      );
    }
  }, [props.theUser]); // Dependency array ensures it re-runs only if user object changes

  return (
    <>
      {/* <p>Hello {props.theUser.name}</p> */}
      {/* <p>Hello {props.theUser?.name}</p>{" "} */}
      {/* Using optional chaining in case name is not always present */}
      <div>My Private Component</div>
      {/* <LoginDashboard userID={theTeacherID} /> */}
      <LoginDashboard sessionToken={sessionToken} />
      {/* <FormToMongo /> */}
      <button onClick={props.theHandleLogout}>Logout</button>
    </>
  );
};

export default DescopeLandingPage;
