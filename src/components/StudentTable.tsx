// StudentTable.tsx

import React, { useState, useEffect } from "react";

import { idGenerator } from "../utils/idGenerator";

import {
  Table,
  TableContainer,
  Paper,
  Button,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import Modal from "@mui/material/Modal";

// --- Import Custom Hooks ---
import { useTableFilters } from "../hooks/useTableFilters";
import { useTableSorting } from "../hooks/useTableSorting";
import { useColumnVisibilityMiniTable } from "../hooks/useColumnVisibility";

import { ColumnVisibilityControlModal } from "./ColumnVisibilityModule";

import { TableHeaderCells, TableBodyRows } from "./TableSubcomponents";

import type {
  RowPage,
  ConfirmUpdateProps,
  ApiResponse,
} from "../utils/dataTypes";

import { allColumnKeys } from "../utils/dataTypes";

// Simple icon components for the collapse button
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
  // Don't render if no student is selected
  if (!props.student) return null;

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

// New Confirmation Modal component for Updates
const UpdateConfirmationModal = (props: {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ConfirmUpdateProps) => Promise<void>;
  message: string;
  currentFirstName: string;
  setCurrentFirstName: (value: string) => void;
  currentLastName: string;
  setCurrentLastName: (value: string) => void;
  currentEmail: string;
  setCurrentEmail: (value: string) => void;
  currentMajor: string;
  setCurrentMajor: (value: string) => void;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}) => {
  // Handler to call the parent's onConfirm with current form data
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
            onClick={handleSubmit}
            sx={{ borderRadius: "8px" }}
            disabled={props.loading}
          >
            Confirm Update
          </Button>
          <Button
            variant="outlined"
            onClick={props.onClose}
            sx={{ borderRadius: "8px" }}
            disabled={props.loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// New Confirmation Modal component for Deletion
const DeletionConfirmationModal = (props: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
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
            disabled={props.loading}
          >
            Confirm Delete
          </Button>
          <Button
            variant="outlined"
            onClick={props.onClose}
            sx={{ borderRadius: "8px" }}
            disabled={props.loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const StudentTable = (props: { thePages: RowPage[]; theToken: string }) => {
  // CHQ: Gemini AI turned this from a variable assigned from a prop into a state variable
  const [rawTableData, setRawTableData] = useState<RowPage[]>(props.thePages);

  // Sync local state with props whenever props.thePages changes
  useEffect(() => {
    setRawTableData(props.thePages);
  }, [props.thePages]);

  // Filter out any rows that have invalid data before passing to hooks
  const initialTableDataForHooks = rawTableData.filter(
    (row) => row && row.FirstName && row.FirstName.trim() !== ""
  );

  // Custom hooks for table functionality
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

  // State for the table collapse functionality
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  // State variables for the "Add New Student" form
  const [myFirstName, setMyFirstName] = useState("");
  const [myLastName, setMyLastName] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const [myMajor, setMyMajor] = useState("");

  // State for API call feedback
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate a new unique ID for a new student
  const newMyID: number = idGenerator(rawTableData);

  // State for the action/confirmation modals
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedStudentForActions, setSelectedStudentForActions] =
    useState<RowPage | null>(null);
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

  // Handler to open the action modal for a specific student
  const handleOpenActionModal = (student: RowPage) => {
    setSelectedStudentForActions(student);
    setIsActionModalOpen(true);
  };

  // Handler to close the action modal
  const handleCloseActionModal = () => {
    setIsActionModalOpen(false);
    setSelectedStudentForActions(null);
  };

  // Handler for adding a new student via a POST request
  const handleNewStudentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const BASE_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCALHOST;
      const sessionToken = props.theToken;

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
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }

      const result: ApiResponse = await response.json();
      console.log("Data sent to database successfully:", result);
      setSuccessMessage("Data sent to database successfully!");

      // Optimistically add the new student to the local state
      setRawTableData((prevData) => [
        ...prevData,
        {
          myID: newMyID,
          FirstName: myFirstName,
          LastName: myLastName,
          Email: myEmail,
          Major: myMajor,
        } as RowPage,
      ]);

      // Clear the form fields after successful submission
      setMyFirstName("");
      setMyLastName("");
      setMyEmail("");
      setMyMajor("");
    } catch (error: any) {
      console.error("Error in database:", error);
      setErrorMessage(
        error.message || "Failed to send data to database. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler to open the update confirmation modal
  const handleEditStudent = (student: RowPage) => {
    console.log("Edit student:", student);
    setStudentToUpdate(student);

    // Populate the update modal's input fields with current student data
    setUpdateFirstName(student.FirstName);
    setUpdateLastName(student.LastName);
    setUpdateEmail(student.Email);
    setUpdateMajor(student.Major || ""); // Use "" for null major
    setIsUpdateConfirmationModalOpen(true);
    handleCloseActionModal();
  };

  // Handler to open the delete confirmation modal
  const handleDeleteStudent = (student: RowPage) => {
    setStudentToDelete(student);
    setIsDeletionConfirmationModalOpen(true);
    handleCloseActionModal();
  };

  // Handler to confirm delete and make the API call
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
      const sessionToken = props.theToken;
      const response = await fetch(`${BASE_URL}/${studentToDelete.myID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
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
      setStudentToDelete(null);
    }
  };

  // Handler to confirm update and make the API call
  const confirmUpdateStudent = async (formData: ConfirmUpdateProps) => {
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

    // Only include properties if they have changed and are not empty strings
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
    // Handle major: if empty string, set to null, otherwise use the new value if changed
    const newMajor = formData.major.trim() === "" ? null : formData.major;
    if (newMajor !== studentToUpdate.Major) {
      updatePayload.major = newMajor;
    }

    if (Object.keys(updatePayload).length === 0) {
      setErrorMessage("No fields provided for update or no changes detected.");
      setLoading(false);
      setIsUpdateConfirmationModalOpen(false);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const BASE_API_URL =
        import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCALHOST;
      const sessionToken = props.theToken;
      const response = await fetch(`${BASE_API_URL}/${studentToUpdate.myID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error during update");
      }

      const result: ApiResponse = await response.json();
      console.log("Student updated successfully:", result);
      setSuccessMessage("Student updated successfully!");

      // Update the student in the local state
      setRawTableData((prevData) =>
        prevData.map((student) =>
          student.myID === studentToUpdate.myID
            ? {
                ...student,
                FirstName: updatePayload.first_name || student.FirstName,
                LastName: updatePayload.last_name || student.LastName,
                Email: updatePayload.email || student.Email,
                Major:
                  updatePayload.major === undefined
                    ? student.Major
                    : updatePayload.major,
              }
            : student
        )
      );

      // Clear the update form fields and selected student
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
      setStudentToUpdate(null);
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

        {/* Column visibility control modal */}
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
          setStudentToUpdate(null);
          setUpdateFirstName("");
          setUpdateLastName("");
          setUpdateEmail("");
          setUpdateMajor("");
          setErrorMessage(null);
          setSuccessMessage(null);
        }}
        onConfirm={confirmUpdateStudent}
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
          setStudentToDelete(null);
          setErrorMessage(null);
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
