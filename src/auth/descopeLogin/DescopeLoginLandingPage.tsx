// DescopeLoginLandingPage.tsx

import LoginDashboard from "../../components/accountAccessPages/LoginDashboard";
import { getSessionToken } from "@descope/react-sdk"; // CHQ: suggested by Descope AI
import { useNavigate, useLocation } from "react-router-dom";

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
