import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import CustomTable from './MyTable'
import StudentTable from "./components/StudentTable";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import StudentsDisplay from "./components/StudentsDisplay";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
// import DataFetcher from "./components/StudentsDisplay";

function OldApp() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

// eslint@typescript-eslint/no-empty-object-type
// interface NavigationButtonsProps {}

// const NavigationButtons: React.FC<NavigationButtonsProps> = () => {
function NavigationButtons() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
      <Button variant="contained" onClick={() => handleNavigate("/orig")}>
        Go to original page
      </Button>
      <Button
        variant="contained"
        onClick={() => handleNavigate("/datafetcher")}
      >
        Go to data fetcher
      </Button>
      <Button variant="contained" onClick={() => handleNavigate("/tabletest")}>
        Go to table testing
      </Button>
    </Box>
  );
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<NavigationButtons />} />
          <Route path="/orig" element={<OldApp />} />
          <Route path="/datafetcher" element={<StudentsDisplay />} />
          {/* <Route path="/datafetcher" element={<DataFetcher />} /> */}
          <Route
            path="/tabletest"
            element={
              <StudentTable
                thePages={[
                  {
                    myID: 101,
                    FirstName: "Steven",
                    LastName: "Okang",
                    Email: "steveokang@gmail.com",
                    Major: "Computer Science",
                  },
                  {
                    myID: 102,
                    FirstName: "Kwame",
                    LastName: "Kingston",
                    Email: "kwamekingston@gmail.com",
                    Major: "Electrical Engineering",
                  },
                ]}
                // theQuantities={[1, 7]}
              />
            }
          />

          {/* <Route path="/test" element={<MyTableTest />} /> */}
          {/* <Route path="/orig" element={ <CustomTable/>} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
