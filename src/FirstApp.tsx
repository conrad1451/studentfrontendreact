// FirstApp.tsx

import SamplePage from "./components/SamplePage";
// import CustomTable from './MyTable'
import StudentTable from "./components/StudentTable";

import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import StudentsDisplay from "./components/StudentsDisplay";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
// import DataFetcher from "./components/StudentsDisplay";

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
        Go to data fetcher (Python-Neon)
      </Button>
      <Button
        variant="contained"
        onClick={() => handleNavigate("/datafetchergo1")}
      >
        Go to data fetcher (Go-Neon)
      </Button>
      <Button variant="contained" onClick={() => handleNavigate("/tabletest")}>
        Go to table testing
      </Button>
    </Box>
  );
}

// const FirstApp = (props: { myUserID: string }) => {
const FirstApp = (props: { mySessionToken: string }) => {
  // console.log("myUserID is " + props.myUserID);
  console.log("mySessionToken is " + props.mySessionToken);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<NavigationButtons />} />
          <Route path="/orig" element={<SamplePage />} />
          <Route
            path="/datafetcher"
            element={
              <StudentsDisplay
                theChoice={1}
                theSessionToken={props.mySessionToken}
              />
              // <StudentsDisplay theChoice={1} myUserID={props.myUserID} />
            }
          />
          <Route
            path="/datafetchergo1"
            element={
              <StudentsDisplay
                theChoice={2}
                theSessionToken={props.mySessionToken}
              />
              // <StudentsDisplay theChoice={1} myUserID={props.myUserID} />
            }
          />

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
                theToken={"sampleToken"}
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
};

export default FirstApp;
