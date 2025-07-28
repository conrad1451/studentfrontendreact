// StudentTable.tsx (From front end code)

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
  TextField, // Added TextField for better input control in modals
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
interface WebFormProps {
  onSubmit: (event: React.FormEvent) => Promise<void>;
}

interface ConfirmUpdateProps {
  first_name: string;
  last_name: string;
  email: string;
  major: string;
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
                          : "Click to sort Ascending."
                      }
                      sx={{
                        minWidth: "auto",
                        p: "2px",
                        // Only show the up arrow if not currently sorted ascending
                        visibility:
                          props.sortProps.sortColumn === colName &&
                          props.sortProps.sortDirection === "asc"
                            ? "visible" // Show if currently ascending
                            : "visible", // Always visible to allow sorting
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
                          : "Click to sort Descending."
                      }
                      sx={{
                        minWidth: "auto",
                        p: "2px",
                        // Only show the down arrow if not currently sorted descending
                        visibility:
                          props.sortProps.sortColumn === colName &&
                          props.sortProps.sortDirection === "desc"
                            ? "visible" // Show if currently descending
                            : "visible", // Always visible to allow sorting
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
                    <TextField
                      type="text"
                      value={props.myFirstName}
                      onChange={(e) => props.setMyFirstName(e.target.value)}
                      placeholder="First Name"
                      size="small"
                      variant="outlined"
                    />
                  ) : colName === "LastName" ? (
                    <TextField
                      type="text"
                      value={props.myLastName}
                      onChange={(e) => props.setMyLastName(e.target.value)}
                      placeholder="Last Name"
                      size="small"
                      variant="outlined"
                    />
                  ) : colName === "Email" ? (
                    <TextField
                      type="email"
                      value={props.myEmail}
                      onChange={(e) => props.setMyEmail(e.target.value)}
                      placeholder="Email"
                      size="small"
                      variant="outlined"
                    />
                  ) : colName === "Major" ? (
                    <TextField
                      type="text"
                      value={props.myMajor}
                      onChange={(e) => props.setMyMajor(e.target.value)}
                      placeholder="Major"
                      size="small"
                      variant="outlined"
                    />
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
const UpdateConfirmationModal = (props: {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ConfirmUpdateProps) => Promise<void>; // Corrected type for onConfirm
  message: string;
  // Pass current student data and setters from parent for editing
  currentFirstName: string;
  setCurrentFirstName: (value: string) => void;
  currentLastName: string;
  setCurrentLastName: (value: string) => void;
  currentEmail: string;
  setCurrentEmail: (value: string) => void;
  currentMajor: string;
  setCurrentMajor: (value: string) => void;
  loading: boolean;
  successMessage: string | null; // Can be null
  errorMessage: string | null; // Can be null
}) => {
  // These states are now managed by the parent (StudentTable) and passed as props
  // const [myFirstName, setMyFirstName] = useState("");
  // const [myLastName, setMyLastName] = useState("");
  // const [myEmail, setMyEmail] = useState("");
  // const [myMajor, setMyMajor] = useState("");

  const handleSubmit = () => {
    props.onConfirm({
      first_name: props.currentFirstName,
      last_name: props.currentLastName,
      email: props.currentEmail,
      major: props.currentMajor,
    });
  };

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="First Name"
            type="text"
            value={props.currentFirstName}
            onChange={(e) => props.setCurrentFirstName(e.target.value)}
            placeholder="First Name"
            size="small"
            variant="outlined"
          />
          <TextField
            label="Last Name"
            type="text"
            value={props.currentLastName}
            onChange={(e) => props.setCurrentLastName(e.target.value)}
            placeholder="Last Name"
            size="small"
            variant="outlined"
          />
          <TextField
            label="Email"
            type="email"
            value={props.currentEmail}
            onChange={(e) => props.setCurrentEmail(e.target.value)}
            placeholder="Email"
            size="small"
            variant="outlined"
          />
          <TextField
            label="Major"
            type="text"
            value={props.currentMajor}
            onChange={(e) => props.setCurrentMajor(e.target.value)}
            placeholder="Major"
            size="small"
            variant="outlined"
          />
        </Box>
        {props.loading && <p>Loading...</p>}
        {props.successMessage && (
          <p style={{ color: "green" }}>{props.successMessage}</p>
        )}
        {props.errorMessage && (
          <p style={{ color: "red" }}>{props.errorMessage}</p>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit} // Call local handleSubmit
            sx={{ borderRadius: "8px" }}
            disabled={props.loading} // Disable during loading
          >
            Confirm Update
          </Button>
          <Button
            variant="outlined"
            onClick={props.onClose}
            sx={{ borderRadius: "8px" }}
            disabled={props.loading} // Disable during loading
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// New Confirmation Modal component
const DeletionConfirmationModal = (props: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  loading: boolean; // Added loading prop
  successMessage: string | null; // Added successMessage prop
  errorMessage: string | null; // Added errorMessage prop
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
        {props.loading && <p>Loading...</p>}
        {props.successMessage && (
          <p style={{ color: "green" }}>{props.successMessage}</p>
        )}
        {props.errorMessage && (
          <p style={{ color: "red" }}>{props.errorMessage}</p>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={props.onConfirm}
            sx={{ borderRadius: "8px" }}
            disabled={props.loading} // Disable during loading
          >
            Confirm Delete
          </Button>
          <Button
            variant="outlined"
            onClick={props.onClose}
            sx={{ borderRadius: "8px" }}
            disabled={props.loading} // Disable during loading
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
    const currentId = row.myID; // Assuming myID is already a number
    return isNaN(currentId) ? max : Math.max(max, currentId);
  }, 0); // Start with 0 if no valid IDs found
  return maxId + 1;
};

const StudentTable = (props: { thePages: RowPage[] }) => {
  const [rawTableData, setRawTableData] = useState<RowPage[]>(props.thePages); // Manage table data locally for updates

  useEffect(() => {
    setRawTableData(props.thePages); // Update local state if props.thePages changes
  }, [props.thePages]);

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

  // --- Moved state variables and submission logic from TableBodyRows to StudentTable ---
  const [myFirstName, setMyFirstName] = useState("");
  const [myLastName, setMyLastName] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [myMajor, setMyMajor] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiURL = import.meta.env.VITE_API_URL; // Declare apiURL here

  const newMyID: number = idGenerator(rawTableData);

  const handleNewStudentSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const BASE_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCALHOST;

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

      // Optimistically add the new student to the table
      setRawTableData((prevData) => [
        ...prevData,
        {
          myID: newMyID,
          FirstName: myFirstName,
          LastName: myLastName,
          Email: myEmail,
          Major: myMajor,
        } as RowPage, // Cast to RowPage
      ]);

      // Clear the form fields after successful submission
      setMyFirstName("");
      setMyLastName("");
      setMyEmail("");
      setMyMajor("");
    } catch (error: any) {
      // Type 'any' for error for now
      console.error("Error in database:", error);
      setErrorMessage(
        error.message || "Failed to send data to database. Please try again."
      );
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
  const [isDeletionConfirmationModalOpen, setIsDeletionConfirmationModalOpen] =
    useState(false);
  const [isUpdateConfirmationModalOpen, setIsUpdateConfirmationModalOpen] =
    useState(false);
  const [studentToDelete, setStudentToDelete] = useState<RowPage | null>(null);
  const [studentToUpdate, setStudentToUpdate] = useState<RowPage | null>(null);

  // States for the update modal's input fields
  const [updateFirstName, setUpdateFirstName] = useState("");
  const [updateLastName, setUpdateLastName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateMajor, setUpdateMajor] = useState("");

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
    setStudentToUpdate(student);
    // Populate the update modal's input fields with current student data
    setUpdateFirstName(student.FirstName);
    setUpdateLastName(student.LastName);
    setUpdateEmail(student.Email);
    setUpdateMajor(student.Major || ""); // Handle null major
    setIsUpdateConfirmationModalOpen(true);
    handleCloseActionModal();
  };

  // Handler to initiate delete (opens confirmation modal)
  const handleDeleteStudent = (student: RowPage) => {
    setStudentToDelete(student);
    setIsDeletionConfirmationModalOpen(true);
    handleCloseActionModal();
  };

  // Handler to confirm delete and make API call
  const confirmDeleteStudent = async () => {
    if (!studentToDelete) {
      console.warn("No student selected for deletion.");
      setIsDeletionConfirmationModalOpen(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const BASE_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCALHOST;
      const sessionToken = "sampleTokenIguess"; // Use a real session token here

      const response = await fetch(`${BASE_URL}/${studentToDelete.myID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        if (response.status >= 400 && response.status < 600) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Server error");
        }
        throw new Error("Failed to delete student");
      }

      console.log(
        `Student with ID ${studentToDelete.myID} deleted successfully.`
      );
      setSuccessMessage("Student deleted successfully!");
      // Remove the student from the local state
      setRawTableData((prevData) =>
        prevData.filter((student) => student.myID !== studentToDelete.myID)
      );
    } catch (error: any) {
      console.error("Error deleting student:", error);
      setErrorMessage(
        error.message || "Failed to delete student. Please try again."
      );
    } finally {
      setLoading(false);
      setIsDeletionConfirmationModalOpen(false);
      setStudentToDelete(null); // Clear selected student
    }
  };

  // Handler to confirm update and make API call
  const confirmUpdateStudent = async (formData: ConfirmUpdateProps) => {
    // Accept formData as parameter
    if (!studentToUpdate) {
      console.warn("No student selected for update.");
      setIsUpdateConfirmationModalOpen(false);
      return;
    }

    // Build the payload for the PATCH request dynamically
    const updatePayload: {
      first_name?: string;
      last_name?: string;
      email?: string;
      major?: string | null;
    } = {};

    // Only include properties if they have changed from the original studentToUpdate values
    // and are not empty strings (unless empty string explicitly means null/clear)
    if (
      formData.first_name.trim() !== "" &&
      formData.first_name !== studentToUpdate.FirstName
    ) {
      updatePayload.first_name = formData.first_name;
    }
    if (
      formData.last_name.trim() !== "" &&
      formData.last_name !== studentToUpdate.LastName
    ) {
      updatePayload.last_name = formData.last_name;
    }
    if (
      formData.email.trim() !== "" &&
      formData.email !== studentToUpdate.Email
    ) {
      updatePayload.email = formData.email;
    }
    // Handle major: if empty string, set to null, otherwise use value if changed
    if (formData.major !== (studentToUpdate.Major || "")) {
      // Compare with empty string if major is null
      updatePayload.major =
        formData.major.trim() === "" ? null : formData.major;
    }

    // If no fields were provided for update, you might want to return early
    if (Object.keys(updatePayload).length === 0) {
      setErrorMessage("No fields provided for update or no changes detected.");
      setIsUpdateConfirmationModalOpen(false);
      setUpdateFirstName("");
      setUpdateLastName("");
      setUpdateEmail("");
      setUpdateMajor(""); // Clear form
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const BASE_API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCALHOST;
      const sessionToken = "sampleTokenIguess";

      const response = await fetch(`${BASE_API_URL}/${studentToUpdate.myID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        if (response.status >= 400 && response.status < 600) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Server error during update");
        }
        throw new Error("Failed to update student");
      }

      const result: ApiResponse = await response.json();
      console.log("Student updated successfully:", result);
      setSuccessMessage("Student updated successfully!");

      // Update the student in the local state after successful update
      setRawTableData((prevData) =>
        prevData.map((student) =>
          student.myID === studentToUpdate.myID
            ? {
                ...student,
                ...updatePayload, // Merge updated fields
                FirstName: updatePayload.first_name || student.FirstName, // Ensure FirstName, LastName etc. are updated on RowPage
                LastName: updatePayload.last_name || student.LastName,
                Email: updatePayload.email || student.Email,
                Major: (updatePayload.major === undefined
                  ? student.Major
                  : updatePayload.major) as string | null,
              }
            : student
        )
      );

      // Clear the update form fields
      setUpdateFirstName("");
      setUpdateLastName("");
      setUpdateEmail("");
      setUpdateMajor("");
    } catch (error: any) {
      console.error("Error updating student:", error);
      setErrorMessage(
        error.message || "Failed to update student. Please try again."
      );
    } finally {
      setLoading(false);
      setIsUpdateConfirmationModalOpen(false);
      setStudentToUpdate(null); // Clear selected student
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" component="div">
            Student Data
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setIsColumnModalOpen(true)}
            >
              Customize Columns
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsTableCollapsed(!isTableCollapsed)}
            >
              {isTableCollapsed ? <MyChevronRightIcon /> : <MyExpandMoreIcon />}{" "}
              {isTableCollapsed ? "Expand" : "Collapse"} Table
            </Button>
          </Box>
        </Box>

        <ColumnVisibilityControlModal
          open={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          visibleColumns={visibleColumns}
          onToggle={handleToggleColumn}
          onSelectPreset={setPresetVisibility}
          onReset={resetVisibility}
          presets={presets}
        />

        {!isTableCollapsed && (
          <TableContainer>
            <Table stickyHeader aria-label="student table">
              <TableHeaderCells
                visibleColumns={visibleColumns}
                sortProps={sortProps}
                sortHandlers={sortHandlers}
                theColumnKeys={allColumnKeys}
              />
              <TableBodyRows
                data={sortedData}
                visibleColumns={visibleColumns}
                theColumnKeys={allColumnKeys}
                onOpenActionModal={handleOpenActionModal}
                myId={newMyID} // Pass the newly generated ID
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
      </Paper>

      {/* Action Modal (Edit/Delete) */}
      <StudentActionModal
        open={isActionModalOpen}
        onClose={handleCloseActionModal}
        student={selectedStudentForActions}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
      />

      {/* Update Confirmation Modal */}
      <UpdateConfirmationModal
        open={isUpdateConfirmationModalOpen}
        onClose={() => {
          setIsUpdateConfirmationModalOpen(false);
          setStudentToUpdate(null); // Clear selected student
          setUpdateFirstName(""); // Clear form fields
          setUpdateLastName("");
          setUpdateEmail("");
          setUpdateMajor("");
          setErrorMessage(null); // Clear messages
          setSuccessMessage(null);
        }}
        onConfirm={confirmUpdateStudent} // Pass the handler
        message={`Are you sure you want to update student ID ${studentToUpdate?.myID}?`}
        currentFirstName={updateFirstName}
        setCurrentFirstName={setUpdateFirstName}
        currentLastName={updateLastName}
        setCurrentLastName={setUpdateLastName}
        currentEmail={updateEmail}
        setCurrentEmail={setUpdateEmail}
        currentMajor={updateMajor}
        setCurrentMajor={setUpdateMajor}
        loading={loading}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      {/* Deletion Confirmation Modal */}
      <DeletionConfirmationModal
        open={isDeletionConfirmationModalOpen}
        onClose={() => {
          setIsDeletionConfirmationModalOpen(false);
          setStudentToDelete(null); // Clear selected student
          setErrorMessage(null); // Clear messages
          setSuccessMessage(null);
        }}
        onConfirm={confirmDeleteStudent}
        message={`Are you sure you want to delete student ID ${studentToDelete?.myID} - ${studentToDelete?.FirstName} ${studentToDelete?.LastName}? This action cannot be undone.`}
        loading={loading}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </Box>
  );
};

export default StudentTable;
