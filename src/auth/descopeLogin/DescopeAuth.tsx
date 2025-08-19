import React, { useState, useEffect } from "react";
import { useDescope, useSession, useUser, Descope } from "@descope/react-sdk";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

// Mock data types and components for a self-contained example.
// In a real application, these would be imported from your project.
type DescopeUser = {
  roleNames?: string[];
  name?: string;
  email?: string;
};

// Mock `DescopeLandingPage` to make the example runnable.
const DescopeLandingPage = ({
  theUser,
  theHandleLogout,
}: {
  theUser: DescopeUser | undefined;
  theHandleLogout: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-xl shadow-lg w-full max-w-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Welcome!</h2>
      <p className="text-center text-gray-600">
        You are authenticated as:{" "}
        <span className="font-semibold">
          {theUser?.name || theUser?.email || "Guest"}
        </span>
      </p>
      <div className="flex flex-col items-center space-y-2">
        <p className="text-gray-500 text-sm">
          Your roles are: {theUser?.roleNames?.join(", ") || "None"}
        </p>
        <p className="text-gray-500 text-sm">
          Permission-based content will be displayed below.
        </p>
      </div>
      <div className="w-full h-1 bg-gray-300 rounded-full my-4" />

      {/* Example UI elements that are conditionally rendered based on permissions,
          which are managed by the parent component's state. */}
      <h3 className="text-xl font-bold text-gray-700 mt-4">
        Permission-Based Content
      </h3>
      <div id="permission-ui" className="w-full space-y-2">
        <div
          data-permission="read"
          className="w-full bg-blue-200 p-3 rounded-lg flex items-center justify-between shadow-sm"
        >
          <span className="font-semibold text-blue-800">Read Access</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-blue-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 18.862A.5.5 0 0 1 16.862 19.5a.5.5 0 0 1-.707 0L12 15.207l-4.155 4.155a.5.5 0 0 1-.707 0 .5.5 0 0 1 0-.707L11.293 14.5l-4.155-4.155a.5.5 0 0 1 0-.707.5.5 0 0 1 .707 0L12 13.793l4.155-4.155a.5.5 0 0 1 .707 0 .5.5 0 0 1 0 .707L12.707 14.5l4.155 4.155z"
            />
          </svg>
        </div>
        <div
          data-permission="update"
          className="w-full bg-green-200 p-3 rounded-lg flex items-center justify-between shadow-sm"
        >
          <span className="font-semibold text-green-800">Update Access</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 18.862A.5.5 0 0 1 16.862 19.5a.5.5 0 0 1-.707 0L12 15.207l-4.155 4.155a.5.5 0 0 1-.707 0 .5.5 0 0 1 0-.707L11.293 14.5l-4.155-4.155a.5.5 0 0 1 0-.707.5.5 0 0 1 .707 0L12 13.793l4.155-4.155a.5.5 0 0 1 .707 0 .5.5 0 0 1 0 .707L12.707 14.5l4.155 4.155z"
            />
          </svg>
        </div>
        <div
          data-permission="delete"
          className="w-full bg-red-200 p-3 rounded-lg flex items-center justify-between shadow-sm"
        >
          <span className="font-semibold text-red-800">Delete Access</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 18.862A.5.5 0 0 1 16.862 19.5a.5.5 0 0 1-.707 0L12 15.207l-4.155 4.155a.5.5 0 0 1-.707 0 .5.5 0 0 1 0-.707L11.293 14.5l-4.155-4.155a.5.5 0 0 1 0-.707.5.5 0 0 1 .707 0L12 13.793l4.155-4.155a.5.5 0 0 1 .707 0 .5.5 0 0 1 0 .707L12.707 14.5l4.155 4.155z"
            />
          </svg>
        </div>
      </div>

      <button
        onClick={theHandleLogout}
        className="w-full px-6 py-3 mt-8 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
};

// Check permissions based on user roles.
const checkPermission = (user: DescopeUser | undefined, permission: string) => {
  if (!user || !user.roleNames) {
    return false;
  }
  const hasAdminRole = user.roleNames.some(
    (role) => role.toLowerCase() === "admin"
  );
  if (hasAdminRole) {
    return true;
  }
  const hasTeacherRole = user.roleNames.some(
    (role) => role.toLowerCase() === "teacher"
  );
  if (hasTeacherRole) {
    return ["read", "update"].includes(permission);
  }
  return false;
};

// A single component to handle all authentication flows.
const AuthFlow = ({
  flowId,
  onSuccess,
  onError,
}: {
  flowId: string;
  onSuccess: (e: any) => void;
  onError: (err: any) => void;
}) => {
  return <Descope flowId={flowId} onSuccess={onSuccess} onError={onError} />;
};

// const Buttons = (props: { theSetChoice: number }) => {

const Buttons = (props: { theSetChoice: (input: number) => void }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
      <Button variant="contained" onClick={() => props.theSetChoice(1)}>
        Go to Guest sign in
      </Button>
      {/* <Button
        variant="contained"
        onClick={() => handleNavigate("/datafetcher")}
      >
        Go to data fetcher (Python-Neon)
      </Button> */}
      <Button variant="contained" onClick={() => props.theSetChoice(2)}>
        Go to User sign in
      </Button>
    </Box>
  );
};

// The main application component.
const App = () => {
  // States for managing UI feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // States for permission-based UI
  const [hasReadPermission, setHasReadPermission] = useState(false);
  const [hasUpdatePermission, setHasUpdatePermission] = useState(false);
  const [hasDeletePermission, setHasDeletePermission] = useState(false);

  const { isAuthenticated, isSessionLoading } = useSession();
  const { user, isUserLoading } = useUser();
  const { logout } = useDescope();

  const [choice, setChoice] = useState(0);

  // Handle successful login
  const handleSuccess = (e: any) => {
    if (e.detail.user) {
      setSuccessMessage("Login successful! Redirecting...");
      updatePermissionsState(e.detail.user as DescopeUser);
      // You can add navigation logic here if using react-router-dom
      // For example: navigate("/secure");
    }
  };

  // Handle login errors
  const handleError = (err: any) => {
    console.error("Authentication Error:", err);
    setErrorMessage(
      err.detail.errorMessage || "An unknown error occurred during sign-in."
    );
  };

  const handleLogout = () => {
    logout();
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // This useEffect hook manages permission-based UI by updating state.
  // It runs whenever the user object changes.
  useEffect(() => {
    if (user) {
      updatePermissionsState(user as DescopeUser);
    }
  }, [user]);

  // Function to update the permission-based state.
  const updatePermissionsState = (user: DescopeUser) => {
    setHasReadPermission(checkPermission(user, "read"));
    setHasUpdatePermission(checkPermission(user, "update"));
    setHasDeletePermission(checkPermission(user, "delete"));
  };

  // This useEffect handles conditionally displaying/hiding elements based on state.
  // It's a cleaner approach than direct DOM manipulation.
  useEffect(() => {
    const permissions = {
      read: hasReadPermission,
      update: hasUpdatePermission,
      delete: hasDeletePermission,
    };

    // Find all elements with a data-permission attribute
    const elements = document.querySelectorAll(`[data-permission]`);

    elements.forEach((element) => {
      const permission = element.getAttribute("data-permission");
      if (permission && element instanceof HTMLElement) {
        // Use the state to determine visibility
        element.style.display = permissions[
          permission as keyof typeof permissions
        ]
          ? "flex"
          : "none";
      }
    });
  }, [hasReadPermission, hasUpdatePermission, hasDeletePermission]);

  if (isSessionLoading || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-medium text-gray-700 animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 font-sans">
      <div className="flex flex-col items-center justify-center w-full max-w-lg">
        {isAuthenticated ? (
          <DescopeLandingPage theUser={user} theHandleLogout={handleLogout} />
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full text-center space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900">Sign In</h1>
            <p className="text-gray-500">Choose your sign-in method below.</p>
            {/* Display error/success messages here */}
            {errorMessage && (
              <div
                className="p-4 mt-4 text-sm text-red-700 bg-red-100 rounded-lg"
                role="alert"
              >
                <span className="font-semibold">Error:</span> {errorMessage}
              </div>
            )}
            {successMessage && (
              <div
                className="p-4 mt-4 text-sm text-green-700 bg-green-100 rounded-lg"
                role="alert"
              >
                <span className="font-semibold">Success:</span> {successMessage}
              </div>
            )}
            <Buttons theSetChoice={setChoice} />
            <div className="space-y-4">
              {choice === 2 && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Regular Sign In
                  </h3>
                  <AuthFlow
                    flowId="sign-up-or-in"
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
              )}
              {choice === 1 && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Guest Sign In
                  </h3>
                  <AuthFlow
                    flowId="create-anonymous-user-with-custom-information"
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
