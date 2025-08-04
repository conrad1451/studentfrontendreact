// DescopeAuth.tsx

import { useCallback } from "react";
// Example using fetch to send Descope token to your backend
// const descopeSessionToken = useSession().sessionToken; // Get the token from Descope's SDK

// Call this function after successfully getting a token from Descope
// loginWithDescopeToken(descopeSessionToken);
import { Descope, useDescope, useSession, useUser } from "@descope/react-sdk";

import DescopeLandingPage from "./DescopeLoginLandingPage";

import { loginWithDescopeToken } from "./authFunctions";

const DescopeAuth = () => {
  // const { isAuthenticated, isSessionLoading } = useSession();
  const { isSessionLoading, sessionToken, isAuthenticated } = useSession();
  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();

  const myUsername = user.name ? user.name : "sample user";

  loginWithDescopeToken(sessionToken, myUsername);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (isSessionLoading || isUserLoading) {
    return <p>Loading...</p>;
  }

  if (isAuthenticated) {
    return (
      <>
        <DescopeLandingPage theUser={user} theHandleLogout={handleLogout} />
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
