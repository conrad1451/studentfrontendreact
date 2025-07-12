import { useCallback, useEffect, useState } from "react";
import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
import { getSessionToken } from "@descope/react-sdk";

const App = () => {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { isUserLoading } = useUser();
  return (
    <div
      style={{
        margin: "5vw",
        width: "90vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      {!isAuthenticated && (
        <Descope
          flowId="sign-up-or-in"
          onSuccess={() => console.log("Logged in!")}
          onError={() => console.log("Could not log in!")}
        />
      )}
      {(isSessionLoading || isUserLoading) && <p>Loading...</p>}
      {!isUserLoading && isAuthenticated && <LoggedIn />}
    </div>
  );
};
