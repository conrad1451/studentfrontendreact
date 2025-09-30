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
const registerTeacherOnBackend = async (user: DescopeUser) => {
  const sessionToken = getSessionToken(); // Get the current session token

  // Ensure we have a token and the necessary user data
  if (!sessionToken || !user.name || !user.loginId || !user.email) {
    console.error(
      "Missing token or required user data for backend registration."
    );
    return;
  }

  // Split the full name into first and last names (simple assumption)
  const names = user.name.split(/\s+/);
  const firstName = names[0];
  const lastName = names.length > 1 ? names.slice(1).join(" ") : names[0]; // If one name, use it as last name too

  const backendData = {
    first_name: firstName,
    last_name: lastName,
    teacher_username: user.loginId, // Assuming loginId is the username or unique identifier
    // Note: The backend handler will use the TeacherID from the *token*, not the body.
  };

  try {
    const response = await fetch("http://localhost:8080/api/registerteacher", {
      // <-- Update URL if needed (e.g., to Vercel URL)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`, // Send the session token for validation
      },
      body: JSON.stringify(backendData),
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

  // Call the function once when the component mounts (i.e., when the user successfully logs in).
  useEffect(() => {
    // Perform an initial check to ensure the user object has the necessary data
    if (props.theUser.name && props.theUser.loginId && props.theUser.email) {
      registerTeacherOnBackend(props.theUser as DescopeUser);
    } else {
      console.warn(
        "User data incomplete. Skipping teacher registration on component mount."
      );
    }
  }, [props.theUser]); // Dependency array ensures it re-runs only if user object changes (though usually only runs once)

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
