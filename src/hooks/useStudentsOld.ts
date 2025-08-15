// src/hooks/useStudents.ts

import { useState, useEffect, useMemo } from "react";
import type { StudentRecord } from "../utils/dataTypes";

import { apiPicker } from "../services/apiPicker";
interface UseStudentsResult {
  students: StudentRecord[];
  loading: boolean;
  error: string | null;
  refetchStudents: () => void; // Add a refetch function
}

// export const useStudents = (
//   theChoice: number,
//   theUserID: string
// ): UseStudentsResult => {
export const useStudents = (
  theChoice: number,
  theSessionToken: string
): UseStudentsResult => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerRefetch, setTriggerRefetch] = useState(0); // State to trigger refetch

  // const apiURL = apiPicker(theChoice, theUserID);
  const apiURL = apiPicker(theChoice);

  // CHQ: Gemini AI memoized headers
  // Assuming theSessionToken is a variable in scope
  const headers = useMemo(() => {
    return {
      Authorization: `Bearer ${theSessionToken}`,
    };
  }, [theSessionToken]);

  // const apiURL=apiPicker(2)

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); // Set loading to true on every fetch attempt
      setError(null); // Clear any previous errors

      // console.log("theUserID is:");
      // console.log(theUserID);

      if (!apiURL) {
        setError("api url is not defined in environment variables.");
        setLoading(false);
        console.error("api url is not set.");
        return;
      }

      try {
        const response = await fetch(apiURL, {
          method: "GET",
          mode: "cors",
          headers: headers,
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: StudentRecord[] = await response.json();
        setStudents(data);
      } catch (e: any) {
        // } catch (e: unknown) {
        // CHQ: Catch clause variable type annotation must be 'any' or 'unknown' if specified.ts(1196)
        //      yet somehow, both 'any' and 'unknown' generate their own errors
        setError(e.message);
        console.error("Failed to fetch students:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [apiURL, headers, triggerRefetch]); // Re-run effect when triggerRefetch changes

  const refetchStudents = () => {
    setTriggerRefetch((prev) => prev + 1); // Increment to trigger refetch
  };

  return { students, loading, error, refetchStudents };
};
