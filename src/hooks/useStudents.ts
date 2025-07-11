// src/hooks/useStudents.ts
// CHQ: Gemini AI generated this

import { useState, useEffect } from "react";
import type { StudentRecord } from "../utils/dataTypes";

interface UseStudentsResult {
  students: StudentRecord[];
  loading: boolean;
  error: string | null;
  refetchStudents: () => void; // Add a refetch function
}

// Ensure VITE_API_URL is set in your .env file (e.g., VITE_API_URL=http://localhost:5000/api/students)
// const apiURL = import.meta.env.VITE_API_URL_OTHERHOST;
const apiURL = import.meta.env.VITE_API_URL;

export const useStudents = (): UseStudentsResult => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0); // State to trigger refetch

  const fetchStudents = async () => {
    setLoading(true); // Set loading to true on every fetch attempt
    setError(null); // Clear any previous errors

    if (!apiURL) {
      setError("API URL is not defined in environment variables.");
      setLoading(false);
      console.error("VITE_API_URL is not set.");
      return;
    }

    try {
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: StudentRecord[] = await response.json();
      setStudents(data);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch students:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [triggerRefetch]); // Re-run effect when triggerRefetch changes

  const refetchStudents = () => {
    setTriggerRefetch((prev) => prev + 1); // Increment to trigger refetch
  };

  return { students, loading, error, refetchStudents };
};
