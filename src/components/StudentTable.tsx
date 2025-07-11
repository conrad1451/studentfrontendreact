// StudentTable.tsx
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
  // TextField,
  FormControlLabel,
  FormControl,
  // InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
// import { SelectChangeEvent } from "@mui/material/Select";
// import FormGroup from "@mui/material/FormGroup";
import Modal from "@mui/material/Modal";
// --- Import Custom Hooks ---

import { useTableFilters } from "../hooks/useTableFilters";
import { useTableSorting } from "../hooks/useTableSorting";

import {
  // useColumnVisibility,
  // ColumnVisibility,
  // visibilityPresets,
  useColumnVisibilityMiniTable,
  //   ColumnVisibilityMiniTable,
  visibilityPresetsMiniTable,
} from "../hooks/useColumnVisibility";

import type { ColumnVisibilityMiniTable } from "../hooks/useColumnVisibility";

// import {
//   mapPagesToCustomTableData,
//   producePropList,
// } from "../../utils/dataTransforms"; // Adjust the path as per your project structure

// import {
//   // mapPagesToCustomTableData,
//   transformStudentRecordToRowPage,
//   producePropList,
// } from "../utils/dataTransforms";

// import axios from "axios";
// import BasicDownshiftV1 from "../dropdown/BasicDropdownList";
import renderModalContent1 from "../renderModalContent";

// import "./App.css";

// import OtherDropdownList from "./OtherDropdownList";
// import "./../MyTable.css"; // Import the CSS file

// --- Interfaces ---
// import { FoodItem, RowPage, FoodPage } from "../../utils/dataTypes";

import type { Item, RowPage, StudentRecord } from "../utils/dataTypes";

const allColumnKeys: Array<keyof ColumnVisibilityMiniTable> = [
  "myID",
  "FirstName",
  // "Qty",
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

// CHQ: Gemini AI debugged this functional component to
//  accomodate generalized functions for props sorting and visibility
const TableHeaderCells = (props: {
  visibleColumns: ColumnVisibilityMiniTable;
  sortProps: ReturnType<typeof useTableSorting>["sortProps"];
  sortHandlers: ReturnType<typeof useTableSorting>["sortHandlers"];
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
}) => {
  // Define sortable columns. This type allows you to specify which columns
  // are actually sortable, if not all `ColumnVisibilityMiniTable` keys are.
  // For this example, all displayed string columns are sortable.
  type SortableTableColumns = "FirstName" | "LastName" | "Email" | "Major";

  // FIX 2 & 3: Correctly call handleSort and use the correct sortProps values.
  // No need for separate maps for handlers, props, and resets for each column.
  // Use the single `handleSort` and `resetSort` exposed by the hook.

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
                {/* Check if the column is one of the "SortableStringKeys" from useTableSorting */}
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
                        // Hide ascending arrow if currently sorted descending or not sorted
                        // Show only if not sorted or currently sorted descending.
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
                        // Hide descending arrow if currently sorted ascending or not sorted
                        // Show only if not sorted or currently sorted ascending.
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

                    {/* Reset Sort Button - show only if this column is currently sorted */}
                    {props.sortProps.sortColumn === colName &&
                      props.sortProps.sortDirection && (
                        <Button
                          onClick={props.sortHandlers.resetSort} // FIX 2: Use the unified resetSort
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
      </TableRow>
    </TableHead>
  );
};

const TableBodyRows = (props: {
  data: RowPage[];
  visibleColumns: ColumnVisibilityMiniTable;
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
}) => {
  return (
    <TableBody>
      {props.data.map((row) => (
        <TableRow key={row.myID}>
          {props.theColumnKeys.map((colName) =>
            props.visibleColumns[colName] ? (
              <TableCell key={colName}>
                {/* Make sure to render the correct property from 'row' based on 'colName' */}
                {colName === "myID" && row.myID}
                {colName === "FirstName" && row.FirstName}
                {colName === "LastName" && row.LastName}
                {colName === "Email" && row.Email}
                {colName === "Major" && (row.Major || "N/A")}{" "}
                {/* Handle null Major */}
              </TableCell>
            ) : null
          )}
        </TableRow>
      ))}
      <TableRow>
        {props.theColumnKeys.map((colName) =>
          props.visibleColumns[colName] ? (
            <TableCell key={colName}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle2" sx={{ mr: 1 }}>
                  {colName === "FirstName"
                    ? "Count of Students: " + String(props.data.length) // Corrected to use props.data.length
                    : ""}
                </Typography>
              </Box>
            </TableCell>
          ) : null
        )}
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

// CHQ: Gemini AI removed useless comments and function exports from hook
const StudentTable = (props: { thePages: RowPage[] }) => {
  // const StudentTable = (props: { thePages: StudentRecord[] }) => {
  // // 1. Data Transformation: Convert StudentRecord[] to RowPage[]
  // const rawTableData: RowPage[] = useMemo(
  //   () => transformStudentRecordToRowPage(props.thePages),

  //   // () => mapPagesToCustomTableData(props.thePages),
  //   [props.thePages]
  // );

  const rawTableData = props.thePages;

  // Filter out rows with empty names (as per your original logic)
  const initialTableDataForHooks = rawTableData.filter(
    (row) => row && row.FirstName && row.FirstName.trim() !== ""
  );

  // 2. Column Visibility Hook
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const {
    visibleColumns,
    handleToggleColumn,
    setPresetVisibility,
    resetVisibility,
    presets,
  } = useColumnVisibilityMiniTable("default"); // Set initial preset

  // 3. Filtering Hook
  // Assuming useTableFilters handles its own logic and returns filteredData
  const { filteredData } = useTableFilters(initialTableDataForHooks); // You might need other filterProps/Handlers later

  // 4. Sorting Hook
  const { sortedData, sortProps, sortHandlers } = useTableSorting(filteredData);

  // The list of all student names, mapped to the { id: number, value: string } Item format
  const allStudentNames: Item[] = useMemo(
    () =>
      rawTableData.map((row) => ({
        id: Math.floor(100 * Math.random()), // Consider using a more stable ID if available
        value: row.FirstName,
      })),
    [rawTableData]
  );

  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  useEffect(() => {
    return () => console.log("StudentTable unmounted or re-rendered");
  }, []);
  useEffect(
    () => console.log("allStudentNames updated:", allStudentNames),
    [allStudentNames]
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (content: string) => {
    setModalContent(content);
    setModalOpen(true);
  };
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
          {/* Changed text */}
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
            <TableBodyRows
              data={sortedData}
              visibleColumns={visibleColumns}
              theColumnKeys={allColumnKeys}
            />
          </Table>
        </TableContainer>
      )}

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box className="myTable-modalBox">
          {" "}
          {/* Assuming CSS classes are defined */}
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Page Content
          </Typography>
          <Typography
            id="modal-modal-description"
            className="myTable-modalDescription"
            component="div"
          >
            {renderModalContent1(modalContent)}
          </Typography>
          <Box className="myTable-modalActions">
            <Button variant="contained" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default StudentTable;
