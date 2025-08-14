export async function loginWithDescopeToken(token: string, username: string) {
  const BASE_API_URL =
    import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCALHOST;

  try {
    const response = await fetch(`${BASE_API_URL}/api/login-with-descope`, {
      // Your backend endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Send the Descope token for your backend to verify
        Authorization: `Bearer ${token}`,
      },
      // You might send other user-related data if needed
      body: JSON.stringify({
        /* any additional data */
        username: username,
      }),
    });

    if (!response.ok) {
      // Handle login error
      const errorData = await response.json();
      console.error("Login failed:", errorData.message);
      return;
    }

    // If successful, your backend will have set the HTTP-only cookie.
    // The frontend doesn't need to do anything with the cookie here.
    console.log("Successfully logged in. Backend set HTTP-only cookie.");
    // Redirect or update UI state as needed
  } catch (error) {
    console.error("Network error or login request failed:", error);
  }
}
