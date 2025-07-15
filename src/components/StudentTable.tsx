import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Icon for the action button

// --- Import Custom Hooks ---
import { useTableFilters } from "../hooks/useTableFilters";
import { useTableSorting } from "../hooks/useTableSorting";
import {
  useColumnVisibilityMiniTable,
  visibilityPresetsMiniTable,
} from "../hooks/useColumnVisibility";

import type { ColumnVisibilityMiniTable } from "../hooks/useColumnVisibility";
import type { Item, RowPage } from "../utils/dataTypes";

// --- WebFormProps & WebForm Component ---
// WebForm no longer needs to know about the individual form fields
// It just needs a handler to call when the form is submitted.
interface WebFormProps {
  onSubmit: (event: React.FormEvent) => Promise<void>;
}

const WebForm: React.FC<WebFormProps> = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {" "}
      {/* Pass the onSubmit handler directly */}
      <button type="submit">Submit data to database</button>
    </form>
  );
};

interface ApiResponse {
  message: string;
  // ... other properties
}

const allColumnKeys: Array<keyof ColumnVisibilityMiniTable> = [
  "myID",
  "FirstName",
  "LastName",
  "Email",
  "Major",
];

const ColumnVisibilityToggles = (props: {
  visibleColumns: ColumnVisibilityMiniTable;
  handleToggleColumn: (event: React.ChangeEvent<HTMLInputElement>) => void;
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
}) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {props.theColumnKeys.map((colName) => (
        <FormControlLabel
          key={colName}
          control={
            <Switch
              checked={props.visibleColumns[colName]}
              onChange={props.handleToggleColumn}
              name={colName}
            />
          }
          label={colName}
        />
      ))}
    </Box>
  );
};

const ColumnVisibilityControlModal = (props: {
  open: boolean;
  onClose: () => void;
  visibleColumns: ColumnVisibilityMiniTable;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectPreset: (preset: keyof typeof visibilityPresetsMiniTable) => void;
  onReset: () => void;
  presets: Map<string, ColumnVisibilityMiniTable>;
}) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: 800 },
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Customize Column Visibility
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Apply Preset:</Typography>
          <FormControl fullWidth size="small">
            <Select
              value=""
              label="Presets"
              onChange={(e) =>
                props.onSelectPreset(
                  e.target.value as keyof typeof visibilityPresetsMiniTable
                )
              }
            >
              <MenuItem value="">
                <em>None (Select Preset)</em>
              </MenuItem>
              {[...props.presets.keys()].map((key) => (
                <MenuItem key={key} value={key}>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={props.onReset} variant="outlined" sx={{ mt: 1 }}>
            Reset to Default
          </Button>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Toggle Individual Columns:
        </Typography>
        <ColumnVisibilityToggles
          visibleColumns={props.visibleColumns}
          handleToggleColumn={props.onToggle}
          theColumnKeys={allColumnKeys}
        />

        <Button onClick={props.onClose} variant="contained" sx={{ mt: 3 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

const TableHeaderCells = (props: {
  visibleColumns: ColumnVisibilityMiniTable;
  sortProps: ReturnType<typeof useTableSorting>["sortProps"];
  sortHandlers: ReturnType<typeof useTableSorting>["sortHandlers"];
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
}) => {
  type SortableTableColumns = "FirstName" | "LastName" | "Email" | "Major";

  return (
    <TableHead>
      <TableRow>
        {props.theColumnKeys.map((colName) =>
          props.visibleColumns[colName] ? (
            <TableCell key={colName}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  {colName}
                </Typography>
                {(
                  [
                    "FirstName",
                    "LastName",
                    "Email",
                    "Major",
                  ] as SortableTableColumns[]
                ).includes(colName as SortableTableColumns) && (
                  <>
                    <Button
                      onClick={() =>
                        props.sortHandlers.handleSort(
                          colName as SortableTableColumns
                        )
                      }
                      title={
                        props.sortProps.sortColumn === colName &&
                        props.sortProps.sortDirection === "asc"
                          ? "Current: Ascending. Click to sort Descending."
                          : props.sortProps.sortColumn === colName &&
                            props.sortProps.sortDirection === "desc"
                          ? "Current: Descending. Click to reset sort."
                          : "Click to sort Ascending."
                      }
                      sx={{
                        minWidth: "auto",
                        p: "2px",
                        visibility:
                          props.sortProps.sortColumn === colName &&
                          props.sortProps.sortDirection === "asc"
                            ? "hidden"
                            : "visible",
                      }}
                    >
                      {props.sortProps.sortColumn === colName &&
                      props.sortProps.sortDirection === "asc"
                        ? "▲"
                        : "⬆️"}
                    </Button>
                    <Button
                      onClick={() =>
                        props.sortHandlers.handleSort(
                          colName as SortableTableColumns
                        )
                      }
                      title={
                        props.sortProps.sortColumn === colName &&
                        props.sortProps.sortDirection === "desc"
                          ? "Current: Descending. Click to reset sort."
                          : props.sortProps.sortColumn === colName &&
                            props.sortProps.sortDirection === "asc"
                          ? "Current: Ascending. Click to sort Descending."
                          : "Click to sort Descending."
                      }
                      sx={{
                        minWidth: "auto",
                        p: "2px",
                        visibility:
                          props.sortProps.sortColumn === colName &&
                          props.sortProps.sortDirection === "desc"
                            ? "hidden"
                            : "visible",
                      }}
                    >
                      {props.sortProps.sortColumn === colName &&
                      props.sortProps.sortDirection === "desc"
                        ? "▼"
                        : "⬇️"}
                    </Button>

                    {props.sortProps.sortColumn === colName &&
                      props.sortProps.sortDirection && (
                        <Button
                          onClick={props.sortHandlers.resetSort}
                          title="Reset All Sorts"
                          sx={{ minWidth: "auto", p: "2px" }}
                        >
                          🔄
                        </Button>
                      )}
                  </>
                )}
              </Box>
            </TableCell>
          ) : null
        )}
        {/* New TableCell for Actions header */}
        <TableCell>
          <Typography variant="subtitle2">Actions</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

// --- TableBodyRowsProps and TableBodyRows Component ---
interface TableBodyRowsProps {
  data: RowPage[];
  visibleColumns: ColumnVisibilityMiniTable;
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
  onOpenActionModal: (student: RowPage) => void;
  // NEW PROPS - passed down from StudentTable
  myId: number;
  myFirstName: string;
  setMyFirstName: (value: string) => void;
  myLastName: string;
  setMyLastName: (value: string) => void;
  myEmail: string;
  setMyEmail: (value: string) => void;
  myMajor: string;
  setMyMajor: (value: string) => void;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  onNewStudentSubmit: (event: React.FormEvent) => Promise<void>;
}

const TableBodyRows = (props: TableBodyRowsProps) => {
  // Remove these state declarations as they are now in StudentTable
  // const [myFirstName, setMyFirstName] = useState("");
  // const [myLastName, setMyLastName] = useState("");
  // const [myEmail, setMyEmail] = useState("");
  // const [myMajor, setMyMajor] = useState("");

  // Remove these state and handler as they are now in StudentTable
  // const [loading, setLoading] = useState(false);
  // const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const handleNewStudentSubmit = async (...) => {...};

  return (
    <TableBody>
      {props.data.map((row) => (
        <TableRow key={row.myID}>
          {props.theColumnKeys.map((colName) =>
            props.visibleColumns[colName] ? (
              <TableCell key={colName}>
                {colName === "myID" && row.myID}
                {colName === "FirstName" && row.FirstName}
                {colName === "LastName" && row.LastName}
                {colName === "Email" && row.Email}
                {colName === "Major" && (row.Major || "N/A")}{" "}
              </TableCell>
            ) : null
          )}
          {/* TableCell for Actions button for existing rows */}
          <TableCell>
            <IconButton
              aria-label="actions"
              onClick={() => props.onOpenActionModal(row)} // Pass the entire row data
            >
              <MoreVertIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
      {/* New Row for adding a student */}
      <TableRow>
        {props.theColumnKeys.map((colName) =>
          props.visibleColumns[colName] ? (
            <TableCell key={colName}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  {colName === "FirstName" ? (
                    <>
                      <label>
                        <input
                          type="text"
                          value={props.myFirstName} // Use props
                          onChange={(e) => props.setMyFirstName(e.target.value)} // Use props
                          placeholder="First Name" // Added placeholder
                        />
                      </label>
                    </>
                  ) : colName === "LastName" ? (
                    <>
                      <label>
                        <input
                          type="text"
                          value={props.myLastName} // Use props
                          onChange={(e) => props.setMyLastName(e.target.value)}
                          placeholder="Last Name" // Added placeholder
                        />
                      </label>
                    </>
                  ) : colName === "Email" ? (
                    <>
                      <label>
                        <input
                          type="email" // Use type="email"
                          value={props.myEmail} // Use props
                          onChange={(e) => props.setMyEmail(e.target.value)}
                          placeholder="Email" // Added placeholder
                        />
                      </label>
                    </>
                  ) : colName === "Major" ? (
                    <>
                      <label>
                        <input
                          type="text"
                          value={props.myMajor} // Use props
                          onChange={(e) => props.setMyMajor(e.target.value)}
                          placeholder="Major" // Added placeholder
                        />
                      </label>
                    </>
                  ) : colName === "myID" ? (
                    <>{props.myId}</>
                  ) : (
                    ""
                  )}
                </Typography>
              </Box>
            </TableCell>
          ) : null
        )}
        {/* Cell for the WebForm in the new student row */}
        <TableCell>
          <div>
            {props.loading && <p>Loading...</p>}
            {props.successMessage && (
              <p style={{ color: "green" }}>{props.successMessage}</p>
            )}
            {props.errorMessage && (
              <p style={{ color: "red" }}>{props.errorMessage}</p>
            )}
            <WebForm onSubmit={props.onNewStudentSubmit} />{" "}
            {/* Pass the submit handler */}
          </div>
        </TableCell>
      </TableRow>
      {/* Footer row (Count of Students) */}
      <TableRow>
        {props.theColumnKeys.map((colName) =>
          props.visibleColumns[colName] ? (
            <TableCell key={colName}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  {colName === "FirstName"
                    ? "Count of Students: " + String(props.data.length)
                    : ""}
                </Typography>
              </Box>
            </TableCell>
          ) : null
        )}
        {/* Empty cell for the actions column in the footer row */}
        <TableCell></TableCell>
      </TableRow>
    </TableBody>
  );
};
const MyChevronRightIcon = () => {
  return <>▶️</>;
};

const MyExpandMoreIcon = () => {
  return <>🔽</>;
};

// New component for the Edit/Delete action modal
const StudentActionModal = (props: {
  open: boolean;
  onClose: () => void;
  student: RowPage | null;
  onEdit: (student: RowPage) => void;
  onDelete: (student: RowPage) => void;
}) => {
  if (!props.student) return null; // Don't render if no student is selected

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "8px", // Rounded corners
        }}
      >
        <Typography variant="h6" component="h2">
          Actions for {props.student.FirstName} {props.student.LastName} (ID:{" "}
          {props.student.myID})
        </Typography>
        <Button
          variant="contained"
          onClick={() => props.onEdit(props.student!)}
          sx={{
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
            borderRadius: "8px",
          }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => props.onDelete(props.student!)}
          sx={{
            borderColor: "error.main",
            color: "error.main",
            "&:hover": { bgcolor: "error.light" },
            borderRadius: "8px",
          }}
        >
          Delete
        </Button>
        <Button
          onClick={props.onClose}
          variant="text"
          sx={{ mt: 1, borderRadius: "8px" }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

// New Confirmation Modal component
const ConfirmationModal = (props: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) => {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "8px",
        }}
      >
        <Typography variant="h6" component="h2">
          Confirmation
        </Typography>
        <Typography>{props.message}</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={props.onConfirm}
            sx={{ borderRadius: "8px" }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            onClick={props.onClose}
            sx={{ borderRadius: "8px" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const idGenerator = (rawTableData: RowPage[]) => {
  // CHQ: Gemini AI added following logic to calculate new ID
  // --- Logic to determine the new myID ---
  const maxId = rawTableData.reduce((max, row) => {
    // const currentId = parseInt(row.myID, 10); // Assuming myID can be parsed as a number
    const currentId = row.myID;

    return isNaN(currentId) ? max : Math.max(max, currentId);
  }, 0); // Start with 0 if no valid IDs found

  // newMyID = String(maxId + 1); // Convert back to string for consistency with RowPage type
  return maxId + 1;
};

const StudentTable = (props: { thePages: RowPage[] }) => {
  const rawTableData = props.thePages;

  const initialTableDataForHooks = rawTableData.filter(
    (row) => row && row.FirstName && row.FirstName.trim() !== ""
  );

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const {
    visibleColumns,
    handleToggleColumn,
    setPresetVisibility,
    resetVisibility,
    presets,
  } = useColumnVisibilityMiniTable("default");

  const { filteredData } = useTableFilters(initialTableDataForHooks);

  const { sortedData, sortProps, sortHandlers } = useTableSorting(filteredData);

  const allStudentNames: Item[] = useMemo(
    () =>
      rawTableData.map((row) => ({
        id: Math.floor(100 * Math.random()), // Consider using a more stable ID if available
        value: row.FirstName,
      })),
    [rawTableData]
  );

  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  //  CHQ: Gemini AI moved state variables and submission logic as part of raising the state

  // --- Moved state variables and submission logic from TableBodyRows to StudentTable ---
  const [myFirstName, setMyFirstName] = useState("");
  const [myLastName, setMyLastName] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [myMajor, setMyMajor] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiURL = import.meta.env.VITE_API_URL; // Declare apiURL here

  // let newMyID: number = -1;

  const newMyID: number = idGenerator(rawTableData);

  const handleNewStudentSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const BASE_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCALHOST;

      // FIXME: CHQ: see if the sessionToken is REALLY needed
      const sessionToken = "sampleTokenIguess"; // Use a real session token here

      // Form the data object from the state variables here in StudentTable
      const formData = {
        id: newMyID,
        first_name: myFirstName,
        last_name: myLastName,
        email: myEmail,
        major: myMajor,
      };

      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`, // Send JWT in Authorization header
        },
        body: JSON.stringify(formData), // Send form data in the body
      });

      if (!response.ok) {
        if (response.status >= 400 && response.status < 600) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Server error");
        }
        throw new Error("Failed to submit to database");
      }

      const result: ApiResponse = await response.json();
      console.log("Data sent to database successfully:", result);
      setSuccessMessage("Data sent to database successfully!");

      // Clear the form fields after successful submission
      setMyFirstName("");
      setMyLastName("");
      setMyEmail("");
      setMyMajor("");
    } catch (error) {
      console.error("Error in database:", error);
      setErrorMessage("Failed to send data to database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // CHQ: Gemini AI added the follow state variables

  // State for the new action modal (Edit/Delete)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedStudentForActions, setSelectedStudentForActions] =
    useState<RowPage | null>(null);

  // State for the confirmation modal
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<RowPage | null>(null);

  // Handler to open the action modal
  const handleOpenActionModal = (student: RowPage) => {
    setSelectedStudentForActions(student);
    setIsActionModalOpen(true);
  };

  // Handler to close the action modal
  const handleCloseActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedStudentForActions(null); // Clear selected student on close
  };

  // Placeholder for Edit action
  const handleEditStudent = (student: RowPage) => {
    console.log("Edit student:", student);
    // In a real application, you would navigate to an edit form
    // or open another modal with the student's editable details.
    handleCloseActionModal();
  };

  // Handler to initiate delete (opens confirmation modal)
  const handleDeleteStudent = (student: RowPage) => {
    setStudentToDelete(student);
    setIsConfirmationModalOpen(true);
    handleCloseActionModal();
  };

  // Handler to confirm deletion and make API call
  const confirmDeleteStudent = async () => {
    if (studentToDelete) {
      try {
        const response = await fetch(`${apiURL}/${studentToDelete.myID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Student deleted successfully:", data);
        // You would typically refetch your student data here to update the table
        // For example: props.onStudentDeleted(studentToDelete.myID);
      } catch (error) {
        console.error("Error deleting student:", error);
        // Handle error (e.g., show an error message to the user)
      } finally {
        setIsConfirmationModalOpen(false); // Close confirmation modal
        setStudentToDelete(null); // Clear student to delete
      }
    }
  };
  useEffect(() => {
    return () => console.log("StudentTable unmounted or re-rendered");
  }, []);
  useEffect(
    () => console.log("allStudentNames updated:", allStudentNames),
    [allStudentNames]
  );

  // The original modal (which seems to be for general content, not specific to student actions)
  const [modalOpen, setModalOpen] = useState(false);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <Box sx={{ p: 2 }}>
      {/* StudentTable Controls Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 2,
          alignItems: "flex-start",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setIsColumnModalOpen(true)}
          sx={{ mb: { xs: 2, md: 0 } }}
        >
          Customize Columns
        </Button>
      </Box>

      {/* Column Visibility Modal */}
      <ColumnVisibilityControlModal
        open={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        visibleColumns={visibleColumns}
        onToggle={handleToggleColumn}
        onSelectPreset={setPresetVisibility}
        onReset={resetVisibility}
        presets={presets}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <IconButton
          onClick={() => setIsTableCollapsed(!isTableCollapsed)}
          aria-label={
            isTableCollapsed ? "Expand StudentTable" : "Collapse StudentTable"
          }
        >
          {isTableCollapsed ? <MyChevronRightIcon /> : <MyExpandMoreIcon />}
        </IconButton>
        <Typography variant="h6">
          {isTableCollapsed ? "Show Student List" : "Student List"}{" "}
        </Typography>
      </Box>

      {/* Main StudentTable Display */}
      {!isTableCollapsed && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table stickyHeader aria-label="student table">
            <TableHeaderCells
              visibleColumns={visibleColumns}
              sortProps={sortProps}
              sortHandlers={sortHandlers}
              theColumnKeys={allColumnKeys}
            />
            {/* CHQ: Gemini AI added props to this as part of raising the state */}
            <TableBodyRows
              data={sortedData}
              visibleColumns={visibleColumns}
              theColumnKeys={allColumnKeys}
              onOpenActionModal={handleOpenActionModal} // Pass the handler down
              // NEW PROPS - passing state and handlers down to TableBodyRows
              myId={newMyID}
              myFirstName={myFirstName}
              setMyFirstName={setMyFirstName}
              myLastName={myLastName}
              setMyLastName={setMyLastName}
              myEmail={myEmail}
              setMyEmail={setMyEmail}
              myMajor={myMajor}
              setMyMajor={setMyMajor}
              loading={loading}
              successMessage={successMessage}
              errorMessage={errorMessage}
              onNewStudentSubmit={handleNewStudentSubmit}
            />
          </Table>
        </TableContainer>
      )}

      {/* Original Modal (unrelated to Edit/Delete actions) */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box className="myTable-modalBox">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Page Content
          </Typography>
          <Typography
            id="modal-modal-description"
            className="myTable-modalDescription"
            component="div"
          >
            {"renderModalContent1(modalContent)"}{" "}
            {/* This line needs attention if `renderModalContent1` is not defined */}
          </Typography>
          <Box className="myTable-modalActions">
            <Button variant="contained" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* CHQ: Gemini AI added the following two components */}
      {/* New Student Action Modal */}
      <StudentActionModal
        open={isActionModalOpen}
        onClose={handleCloseActionModal}
        student={selectedStudentForActions}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent} // This now triggers the confirmation modal
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDeleteStudent}
        message={`Are you sure you want to delete ${studentToDelete?.FirstName} ${studentToDelete?.LastName} (ID: ${studentToDelete?.myID})? This action cannot be undone.`}
      />
    </Box>
  );
};

export default StudentTable;
