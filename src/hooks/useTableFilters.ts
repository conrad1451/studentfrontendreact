// useTableFilters.ts

import { useState, useMemo } from "react";
// import { SelectChangeEvent } from "@mui/material/Select"; // For Material-UI Select events

import type { RowPage } from "../utils/dataTypes";

// interface Item {
//   value: string;
// }

// --- Utility Filtering Functions (Can be moved to a separate file like utils/filters.ts) ---

/**
 * Filters RowPage data based on a single selected value for a specified key.
 * @param filterEnabled - Boolean to enable/disable this filter.
 * @param selectedValue - The value to filter by.
 * @param curData - The current array of RowPage objects to filter.
 * @param selection - The key (property name) on which to apply the filter.
 * @returns Filtered array of RowPage objects.
 */
// function filterBySingleSelect(
//   filterEnabled: boolean,
//   selectedValue: string,
//   curData: RowPage[],
//   selection: "Source"
// ): RowPage[] {
//   if (filterEnabled && selectedValue !== "") {
//     return curData.filter((row) => row[selection] === selectedValue);
//   }
//   return curData;
// }

/**
 * Filters RowPage data based on whether the Name property includes the filter text (case-insensitive).
 * @param data - The array of RowPage objects to filter.
 * @param enabled - Boolean to enable/disable this filter.
 * @param filterText - The text to search for in the Name property.
 * @returns Filtered array of RowPage objects.
 */
function filterByPageName(
  data: RowPage[],
  enabled: boolean,
  filterText: string
): RowPage[] {
  if (enabled && filterText.trim() !== "") {
    return data.filter((row) =>
      row.FirstName.toLowerCase().includes(filterText.toLowerCase())
    );
  }
  return data;
}

function filterByLastName(
  data: RowPage[],
  enabled: boolean,
  filterText: string
): RowPage[] {
  if (enabled && filterText.trim() !== "") {
    return data.filter((row) =>
      row.LastName.toLowerCase().includes(filterText.toLowerCase())
    );
  }
  return data;
}

function filterByMajor(
  data: RowPage[],
  enabled: boolean,
  filterText: string
): RowPage[] {
  if (enabled && filterText.trim() !== "") {
    return data.filter((row) =>
      row.Major.toLowerCase().includes(filterText.toLowerCase())
    );
  }
  return data;
}

// --- useTableFilters Custom Hook ---

/**
 * A custom React hook for managing all table filtering logic and state.
 * It takes the raw table data and returns the filtered data, along with
 * filter properties and handler functions to control the filters.
 *
 * @param initialData The initial, unfiltered data in RowPage[] format.
 * @returns An object containing:
 * - filteredData: The RowPage[] array after all filters have been applied.
 * - filterProps: An object containing all the state variables for filters.
 * - filterHandlers: An object containing all the functions to change filter states.
 * - derivedLists: An object containing lists derived from the data for filter options (e.g., tag counts).
 */
export const useTableFilters = (initialData: RowPage[]) => {
  // --- State for Filters ---
  const [firstnameFilterEnabled, setFirstNameFilterEnabled] = useState(false);
  const [firstnameFilterText, setFirstNameFilterText] = useState("");

  const [lastnameFilterEnabled, setLastNameFilterEnabled] = useState(false);
  const [lastnameFilterText, setLastNameFilterText] = useState("");

  const [majorFilterEnabled, setMajorFilterEnabled] = useState(false);
  const [majorFilterText, setMajorFilterText] = useState("");

  // --- Filter Handlers ---

  const handleFirstNameFilterToggle = () => {
    setFirstNameFilterEnabled((prev) => !prev);
    setFirstNameFilterText(""); // Clear filter text when toggling off
  };

  const handleLastNameFilterToggle = () => {
    setLastNameFilterEnabled((prev) => !prev);
    setLastNameFilterText(""); // Clear filter text when toggling off
  };

  const handleMajorFilterToggle = () => {
    setMajorFilterEnabled((prev) => !prev);
    setMajorFilterText(""); // Clear filter text when toggling off
  };

  // --- Reset Functions ---
  const resetFirstNameFilters = () => {
    setFirstNameFilterText("");
    setFirstNameFilterEnabled(false);
  };

  const resetLastNameFilters = () => {
    setLastNameFilterText("");
    setLastNameFilterEnabled(false);
  };

  const resetMajorFilters = () => {
    setMajorFilterText("");
    setMajorFilterEnabled(false);
  };

  // --- Memoized Filtered Data ---
  const filteredData = useMemo(() => {
    let currentFilteredData = initialData;

    // Apply page name filter
    currentFilteredData = filterByFirstName(
      currentFilteredData,
      firstnameFilterEnabled,
      firstnameFilterText
    );

    currentFilteredData = filterByLastName(
      currentFilteredData,
      lastnameFilterEnabled,
      lastnameFilterText
    );

    currentFilteredData = filterByMajor(
      currentFilteredData,
      majorFilterEnabled,
      majorFilterText
    );

    return currentFilteredData;
  }, [
    initialData,
    firstnameFilterEnabled,
    firstnameFilterText,
    lastnameFilterEnabled,
    lastnameFilterText,
    majorFilterEnabled,
    majorFilterText,
  ]);

  return {
    filteredData,
    filterProps: {
      isFirstNameFilterEnabled: firstnameFilterEnabled,
      firstnameFilterText,
      isLastNameFilterEnabled: lastnameFilterEnabled,
      lastnameFilterText,
      isMajorFilterEnabled: majorFilterEnabled,
      majorFilterText,
    },
    filterHandlers: {
      toggleFirstNameFilter: handleFirstNameFilterToggle,
      setFirstNameFilterText,
      resetFirstNameFilters,
      toggleLastNameFilter: handleLastNameFilterToggle,
      setLastNameFilterText,
      resetLastNameFilters,
      toggleMajorFilter: handleMajorFilterToggle,
      setMajorFilterText,
      resetMajorFilters,
    },
  };
};
