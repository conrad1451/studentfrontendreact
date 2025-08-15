// DescopeAuth.tsx

// Sources:
// [1]: https://www.descope.com/blog/post/auth-rbac-webflow

import { useCallback } from "react";
// Example using fetch to send Descope token to your backend
// const descopeSessionToken = useSession().sessionToken; // Get the token from Descope's SDK

// import { Descope, useDescope, useSession, useUser } from "@descope/react-sdk";

import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
// import { getSessionToken } from "@descope/react-sdk"; // CHQ: suggested by Descope AI
// import { useNavigate } from "react-router-dom";

import DescopeLandingPage from "./DescopeLoginLandingPage";

import type { DescopeUser } from "../../utils/dataTypes";

// Source: [1]
function checkPermission(user: DescopeUser, permission: string) {
  const hasTeacherRole =
    user.roleNames &&
    user.roleNames.some((role) => role.toLowerCase() === "teacher");
  const hasAdminRole =
    user.roleNames &&
    user.roleNames.some((role) => role.toLowerCase() === "admin");

  if (hasAdminRole) {
    return true;
  }

  if (hasTeacherRole) {
    return ["read", "update"].includes(permission);
  }
}

function updateUIBasedOnPermissions(user: DescopeUser) {
  const permissions = ["create", "update", "delete", "publish"];
  permissions.forEach((permission) => {
    const elements = document.querySelectorAll(
      `[data-permission="${permission}"]`
    );
    const shouldDisplay = checkPermission(user, permission);
    elements.forEach((element) => {
      // CHQ: Gemini AI added check for the element being an HTMLElement before trying to access 'style' property
      if (element instanceof HTMLElement) {
        element.style.display = shouldDisplay ? "inline-block" : "none";
      }
    });
  });
}

const DescopeAuth = () => {
  // const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
  const { isAuthenticated, isSessionLoading } = useSession();
  // const sessionToken = getSessionToken();
  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();

  // const myUsername = user.name ? user.name : "sample user";

  // loginWithDescopeToken(sessionToken, myUsername);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  // const navigate = useNavigate();

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

  // CHQ: Gemini AI improved error checking in onSuccess property of Descope functional component
  return (
    <div>
      <h1>Sign In</h1>
      <Descope
        flowId="sign-up-or-in"
        onSuccess={(e) => {
          console.log(e.detail.user?.name);
          console.log(e.detail.user?.email);
          // Check if e.detail.user is not undefined before calling the function.
          if (e.detail.user) {
            updateUIBasedOnPermissions(e.detail.user as DescopeUser);
          }
          // navigate("/secure");
        }}
        onError={(err) => {
          console.log("Error!", err);
          alert("Error: " + err.detail.errorMessage);
          console.log("Could not log in");
        }}
      />
    </div>
  );
};

export default DescopeAuth;
