// CHQ: Gemini AI generated this
import React, { useState } from "react";
import type { FormEvent } from "react";

// --- Type Definitions ---
interface StudentData {
  first_name: string;
  last_name: string;
  email: string;
}

interface AppProps {
  // Assuming the session token is passed down for the authenticated request
  sessionToken: string;
}

// NOTE: In a real application, VITE_API_GO_URL would be loaded from .env
// We mock it here for the single-file environment.
const BASE_API_URL = import.meta.env.VITE_API_GO_URL;

// --- Form Component ---
const StudentCreationForm: React.FC<AppProps> = ({ sessionToken }) => {
  const [formData, setFormData] = useState<StudentData>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({ text: "", type: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: null });

    // const apiURL = `${BASE_API_URL}/godbstudents`; // Endpoint to create a student
    // const apiURL = `${BASE_API_URL}/teacherprofile`; // Endpoint to create a student
    const apiURL = `${BASE_API_URL}/teacherprofilealt`; // Endpoint to create a student

    // Basic form validation (for demonstration)
    if (!formData.first_name || !formData.last_name || !formData.email) {
      setMessage({ text: "All fields are required.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiURL, {
        method: "PATCH",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          // CRITICAL: Send the session token for authorization
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // Handle case where body is not JSON (e.g., plain text 500)
          throw new Error(
            `HTTP error! Status: ${response.status}. Failed to parse error response.`
          );
        }
        throw new Error(
          errorData.message ||
            `Failed to create student. Status: ${response.status}`
        );
      }

      // Success handling
      const result = await response.json();
      setMessage({
        text: `Success! Student ${result.first_name} ${result.last_name} (ID: ${result.id}) created.`,
        type: "success",
      });
      // Clear the form after successful submission
      setFormData({ first_name: "", last_name: "", email: "" });
      console.log("API Response:", result);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.error("Submission error:", errorMessage);
      setMessage({ text: `Submission Failed: ${errorMessage}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Profile
        </h1>

        {/* Status Message */}
        {message.text && (
          <div
            className={`p-3 mb-4 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name Input */}
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="e.g., Alex"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              disabled={loading}
            />
          </div>

          {/* Last Name Input */}
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="e.g., Johnson"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              disabled={loading}
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., student@example.edu"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white transition duration-200 ease-in-out ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Update Teacher Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const TeacherInfo = (props: { mySessionToken: string }) => {
  return <StudentCreationForm sessionToken={mySessionToken} />;
};

export default TeacherInfo;
