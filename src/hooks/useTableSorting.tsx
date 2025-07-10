import { useState, useMemo } from "react";

import { RowPage } from "../utils/dataTypes";

/**
 * Comparator function for sorting RowPage objects by Name.
 * @param a - First RowPage object.
 * @param b - Second RowPage object.
 * @param direction - Sort direction ("asc" or "desc").
 * @returns -1 if a < b, 1 if a > b, 0 if equal, based on direction.
 */
function sortByNameComparator(
  a: RowPage,
  b: RowPage,
  direction: "asc" | "desc"
): number {
  const nameA = a.Name.toLowerCase();
  const nameB = b.Name.toLowerCase();
  if (nameA < nameB) {
    return direction === "asc" ? -1 : 1;
  }
  if (nameA > nameB) {
    return direction === "asc" ? 1 : -1;
  }
  return 0;
}

// --- useTableSorting Custom Hook ---

/**
 * A custom React hook for managing all table sorting logic and state.
 * It takes filtered data and returns the sorted data, along with
 * sort properties and handler functions to control the sorting.
 *
 * @param filteredData The array of RowPage objects after filtering has been applied.
 * @returns An object containing:
 * - sortedData: The RowPage[] array after sorting has been applied.
 * - sortProps: An object containing all the state variables for sorting (e.g., current sort directions).
 * - sortHandlers: An object containing all the functions to change sort states.
 */
export const useTableSorting = (filteredData: RowPage[]) => {
  // --- State for Sort Directions ---
  const [sortDirectionName, setSortDirectionName] = useState<
    "asc" | "desc" | null
  >(null);

  // --- Reset Functions for Sorting ---
  const resetNameSort = () => setSortDirectionName(null);

  // --- Sort Handlers (to be called by UI) ---
  const handleNameSort = (direction: "asc" | "desc") => {
    setSortDirectionName(direction);

    // --- Memoized Sorted Data ---
    const sortedData = useMemo(() => {
      const sortableData = [...filteredData]; // Create a shallow copy to avoid mutating original array

      if (sortDirectionName) {
        sortableData.sort((a, b) =>
          sortByNameComparator(a, b, sortDirectionName)
        );
      }

      return sortableData;
    }, [filteredData, sortDirectionName]);

    return {
      sortedData,
      sortProps: {
        sortDirectionName,
      },
      sortHandlers: {
        handleNameSort,
        resetNameSort,
      },
    };
  };
};
