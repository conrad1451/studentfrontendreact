// DescopeAuth.tsx

import { useCallback } from "react";

// import { Descope, useDescope, useSession, useUser } from "@descope/react-sdk";

import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
// import { getSessionToken } from "@descope/react-sdk"; // CHQ: suggested by Descope AI

import DescopeLandingPage from "./DescopeLoginLandingPage";

const DescopeAuth = () => {
  // const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
  const { isAuthenticated, isSessionLoading } = useSession();
  // const sessionToken = getSessionToken();

  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (isSessionLoading || isUserLoading) {
    return <p>Loading...</p>;
  }
  // console.log("sessionToken is " + sessionToken);

  // CHQ: made by Descope AI
  // const exampleFetchCall = async () => {
  //   const sessionToken = getSessionToken();

  //   // Example Fetch Call with HTTP Authentication Header
  //   fetch("your_application_server_url", {
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: "Bearer " + sessionToken,
  //     },
  //   });
  // };

  if (isAuthenticated) {
    return (
      <>
        <DescopeLandingPage
          theUser={user}
          // theToken={JSON.stringify(sessionToken)}
          // theToken={sessionToken}
          theHandleLogout={handleLogout}
        />
      </>
    );
  }

  return (
    <div>
      <h1>Sign In</h1>
      <Descope
        flowId="sign-up-or-in"
        onSuccess={(e) => console.log(e.detail.user)}
        onError={() => console.log("Could not log in!")}
      />
    </div>
  );
};

export default DescopeAuth;
