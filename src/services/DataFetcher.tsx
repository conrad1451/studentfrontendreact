// CHQ: Gemini AI made scaffolding, and I renamed the module

// src/DataFetcher.tsx (for a TypeScript project)
import { useState, useEffect } from "react";
// import "./DataFetcher.css"; // Assuming you have some basic CSS

// Define a type for your Student object
interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  major: string | null;
  enrollment_date: string; // Date string from backend
}

const apiURL = import.meta.env.API_URL;

function DataFetcher() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(apiURL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Student[] = await response.json();
        setStudents(data);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch students:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array means this runs once on component mount

  if (loading) return <div>Loading students...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    // <div className="DataFetcher">
    <div>
      <h1>Student Management Dashboard</h1>
      <h2>Students List</h2>
      {students.length === 0 ? (
        <p>
          No students found. Add some from your database or via a POST request.
        </p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.first_name} {student.last_name} - {student.email} (Major:{" "}
              {student.major || "N/A"})
            </li>
          ))}
        </ul>
      )}
      {/* You can add forms for POST, PUT, DELETE here later */}
    </div>
  );
}

export default DataFetcher;
