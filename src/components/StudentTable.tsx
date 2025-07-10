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

// need another
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

import { mapPagesToCustomTableData } from "../utils/dataTransforms";

// import axios from "axios";
import BasicDownshiftV1 from "../dropdown/BasicDropdownList";
import renderModalContent1 from "../renderModalContent";
// import "./App.css";

// import OtherDropdownList from "./OtherDropdownList";
// import "./../MyTable.css"; // Import the CSS file

// --- Interfaces ---
import { FoodItem, RowPage, FoodPage } from "../../utils/dataTypes";

const allColumnKeys: Array<keyof ColumnVisibilityMiniTable> = [
  "Name",
  "Qty",
  "Source",
  "UnitSize",
  "ServingSize",
  "Fat",
  "SatFat",
  "Sodium",
  "Protein",
  "Carbs",
  "Fiber",
  "Sugar",
  "AddedSugar",
  // "PageURL",
  // "pageContent",
];

// --- Helper Functions ---
// function createMiniTableData(
//   myID: string,
//   Name: string,
//   Source: string[],
//   Tags: string[],
//   Company: string,
//   PageURL: string,
//   pageContent: string,
//   CreatedTime: Date,
//   EditedTime: Date,
//   UnitSize: string,
//   UnitCount: number,
//   ServingSize: string,
//   ServingCount: number,
//   Fat: number,
//   SatFat: number,
//   Sodium: number,
//   Protein: number,
//   Carbs: number,
//   Fiber: number,
//   Sugar: number,
//   AddedSugar: number
// ): RowPage {
//   return {
//     myID,
//     Name,
//     Source: Source.join(" | "),
//     Tags,
//     Company,
//     PageURL,
//     pageContent,
//     CreatedTime,
//     EditedTime,
//     UnitSize,
//     UnitCount,
//     ServingSize,
//     ServingCount,
//     Fat,
//     SatFat,
//     Sodium,
//     Protein,
//     Carbs,
//     Fiber,
//     Sugar,
//     AddedSugar,
//   };
// }

// function mapPagesToCustomTableData(pages: FoodPage[]): RowPage[] {
//   return pages.map((page) =>
//     createMiniTableData(
//       page.id,
//       page.Name,
//       page.Source,
//       page.Tags,
//       page.Company,
//       page.PageURL,
//       page.pageContent,
//       page.CreatedTime,
//       page.EditedTime,
//       page.UnitSize,
//       page.UnitCount,
//       page.ServingSize,
//       page.ServingCount,
//       page.Fat,
//       page.SatFat,
//       page.Sodium,
//       page.Protein,
//       page.Carbs,
//       page.Fiber,
//       page.Sugar,
//       page.AddedSugar
//     )
//   );
// }

// ------------------------------------------------------------//

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
          width: { xs: "90%", sm: "80%", md: 800 }, // Responsive width
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
              value="" // No initial selection, user chooses from list
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
                  {/* Format camelCase to readable */}
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
  // Modified: Only include truly sortable columns
  const sortableColumns: Partial<
    Record<keyof ColumnVisibilityMiniTable, (direction: "asc" | "desc") => void>
  > = {
    FirstName: props.sortHandlers.handleNameSort,
    LastName: props.sortHandlers.handleNameSort,
    Email: props.sortHandlers.handleNameSort,
    Major: props.sortHandlers.handleNameSort,
    // CreatedStart: props.sortHandlers.handleNotedTimeSort,
  };

  // Modified: Only include sort directions for truly sortable columns
  const sortDirectionMap: Partial<
    Record<keyof ColumnVisibilityMiniTable, "asc" | "desc" | null>
  > = {
    FirstName: props.sortProps.sortDirectionName,
    LastName: props.sortProps.sortDirectionName,
    Email: props.sortProps.sortDirectionName,
    Major: props.sortProps.sortDirectionName,
  };

  // Modified: Only include reset handlers for truly sortable columns
  const resetSortHandlerMap: Partial<
    Record<keyof ColumnVisibilityMiniTable, () => void>
  > = {
    FirstName: props.sortHandlers.resetNameSort,
    LastName: props.sortHandlers.resetNameSort,
    Email: props.sortHandlers.resetNameSort,
    Major: props.sortHandlers.resetNameSort,
  };

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
                {sortableColumns[colName] && ( // This condition now correctly checks if the column is sortable
                  <>
                    <Button
                      onClick={() => sortableColumns[colName]?.("asc")} // Added optional chaining
                      title="Sort Ascending"
                      sx={{
                        minWidth: "auto",
                        p: "2px",
                        visibility:
                          sortDirectionMap[colName] === "asc"
                            ? "hidden"
                            : "visible",
                      }}
                    >
                      ⬆️
                    </Button>
                    <Button
                      onClick={() => sortableColumns[colName]?.("desc")} // Added optional chaining
                      title="Sort Descending"
                      sx={{
                        minWidth: "auto",
                        p: "2px",
                        visibility:
                          sortDirectionMap[colName] === "desc"
                            ? "hidden"
                            : "visible",
                      }}
                    >
                      ⬇️
                    </Button>
                    {sortDirectionMap[colName] && (
                      <Button
                        onClick={resetSortHandlerMap[colName]}
                        title="Reset Sort"
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
  FoodQty: number[];
  visibleColumns: ColumnVisibilityMiniTable;
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
}) => {
  // CHQ: Gemini AI generated
  // Helper function to calculate the dot product for a given nutrient column
  const calculateDotProduct = (
    nutrientColName: keyof RowPage,
    data: RowPage[],
    quantities: number[]
  ) => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      const quantity = quantities[i] || 0; // Default to 0 if quantity is undefined
      const nutrientValue = (data[i][nutrientColName] as number) || 0; // Cast to number, default to 0
      total += quantity * nutrientValue;
    }
    return total.toFixed(2); // Format to two decimal places
  };

  return (
    <TableBody>
      {props.data.map((row, index) => (
        <TableRow key={row.myID}>
          {props.theColumnKeys.map((colName) =>
            props.visibleColumns[colName] ? (
              <TableCell key={colName}>
                {colName === "FirstName" && row.FirstName}
                {/* below caused an error */}
                {colName === "Qty" && props.FoodQty[index]}
                {/* {colName === "Qty" && row.ServingCount} */}
                {/* NEW: Display ServingCount as Qty */}
                {colName === "LastName" && row.LastName}
                {colName === "Email" && row.Email}
                {colName === "Major" && row.Major}
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
                    ? "Count of Students" + String("data.length")
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

const StudentTable = (props: {
  thePages: FoodPage[];
  theQuantities: number[];
}) => {
  // 1. Data Transformation: Convert FoodPage[] to RowPage[]
  const rawTableData: RowPage[] = useMemo(
    () => mapPagesToCustomTableData(props.thePages),
    [props.thePages]
  );

  // Filter out rows with empty names (as per your original logic)
  const initialTableDataForHooks = rawTableData.filter(
    (row) => row && row.Name && row.Name.trim() !== ""
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
  const { filteredData, filterProps, filterHandlers, derivedLists } =
    useTableFilters(initialTableDataForHooks);

  // 4. Sorting Hook
  const { sortedData, sortProps, sortHandlers } = useTableSorting(filteredData);

  // Derive lists for dropdowns based on the currently filtered data
  // These should be passed to FilterControlsSection
  const tagList = useMemo(
    () => producePropList(sortedData, "Tags"),
    [sortedData]
  );

  const sourceList = useMemo(
    () => producePropList(sortedData, "Source"),
    [sortedData]
  );

  // The list of all available food names, mapped to the { value: string } FoodItem format
  const allFoodNames: FoodItem[] = useMemo(
    () =>
      rawTableData.map((row) => ({
        id: Math.floor(100 * Math.random()),
        value: row.Name,
      })),
    [rawTableData]
  );

  //   // State to hold the processed lines from FoodEntryProcessor
  const [foodEntryProcessedLines, setFoodEntryProcessedLines] = useState<
    { id: string; text: string; matchedItem: FoodItem | null }[]
  >([]);

  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  useEffect(() => {
    return () => console.log("StudentTable unmounted or re-rendered"); // Corrected log
  }, []);
  useEffect(
    () => console.log("allFoodNames updated:", allFoodNames),
    [allFoodNames]
  );
  // Log the processed lines from FoodEntryProcessor
  useEffect(() => {
    console.log("Food Entry Processed Lines:", foodEntryProcessedLines);
  }, [foodEntryProcessedLines]);

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
      {/* <Box>
        <Button
          variant="contained"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            handleOpenModal("bro testing")
          }
        >
          test open modal with message
        </Button>
      </Box> */}
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
      {/* NEW: Integrate the FoodEntryProcessor */}
      {/* <FoodEntryProcessor
        foodItems={allFoodNames}
        onFinalSelectionsChange={setFoodEntryProcessedLines} // Store the processed lines here
      /> */}

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
          {isTableCollapsed ? "Show Meal Breakdown" : "Meal Breakdown"}
        </Typography>
      </Box>

      {/* Main StudentTable Display */}
      {!isTableCollapsed && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table stickyHeader aria-label="job application table">
            <TableHeaderCells
              visibleColumns={visibleColumns}
              sortProps={sortProps}
              sortHandlers={sortHandlers}
              theColumnKeys={allColumnKeys}
            />
            <TableBodyRows
              data={sortedData}
              FoodQty={props.theQuantities}
              visibleColumns={visibleColumns}
              theColumnKeys={allColumnKeys}
            />
          </Table>
        </TableContainer>
      )}

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
            {renderModalContent1(modalContent)}
          </Typography>
          <Box className="myTable-modalActions">
            <Button variant="contained" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Optional: MyDataBreakdown */}
      {/* If MyDataBreakdown needs filtered/sorted data, pass `sortedData` */}
      {/* <MyDataBreakdown data={sortedData} /> */}
    </Box>
  );
};

export default StudentTable;
