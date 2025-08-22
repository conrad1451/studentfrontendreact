// DescopeLoginLandingPage.tsx

import LoginDashboard from "../../components/accountAccessPages/LoginDashboard";
import { getSessionToken } from "@descope/react-sdk"; // CHQ: suggested by Descope AI

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
