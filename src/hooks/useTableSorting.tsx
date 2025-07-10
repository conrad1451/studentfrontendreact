import { useState, useMemo } from "react";

import type { RowPage } from "../utils/dataTypes";

/**
 * Comparator function for sorting RowPage objects by Name.
 * @param a - First RowPage object.
 * @param b - Second RowPage object.
 * @param direction - Sort direction ("asc" or "desc").
 * @returns -1 if a < b, 1 if a > b, 0 if equal, based on direction.
 */
function sortByFirstNameComparator(
  a: RowPage,
  b: RowPage,
  direction: "asc" | "desc"
): number {
  const nameA = a.FirstName.toLowerCase();
  const nameB = b.FirstName.toLowerCase();
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
  const [sortDirectionFirstName, setSortDirectionFirstName] = useState<
    "asc" | "desc" | null
  >(null);

  // const [sortDirectionLastName, setSortDirectionLastName] = useState<
  //   "asc" | "desc" | null
  // >(null);

  // const [sortDirectionEmail, setSortDirectionEmail] = useState<
  //   "asc" | "desc" | null
  // >(null);

  // const [sortDirectionMajor, setSortDirectionMajor] = useState<
  //   "asc" | "desc" | null
  // >(null);

  // --- Reset Functions for Sorting ---
  const resetFirstNameSort = () => setSortDirectionFirstName(null);
  // const resetLastNameSort = () => setSortDirectionLastName(null);
  // const resetEmailSort = () => setSortDirectionEmail(null);
  // const resetMajorSort = () => setSortDirectionMajor(null);

  // --- Sort Handlers (to be called by UI) ---
  const handleFirstNameSort = (direction: "asc" | "desc") => {
    setSortDirectionFirstName(direction);

    // --- Memoized Sorted Data ---
    const sortedData = useMemo(() => {
      const sortableData = [...filteredData]; // Create a shallow copy to avoid mutating original array

      if (sortDirectionFirstName) {
        sortableData.sort((a, b) =>
          sortByFirstNameComparator(a, b, sortDirectionFirstName)
        );
      }

      return sortableData;
    }, [filteredData, sortDirectionFirstName]);

    return {
      sortedData,
      sortProps: {
        sortDirectionFirstName,
      },
      sortHandlers: {
        handleFirstNameSort,
        resetFirstNameSort,
      },
    };
  };
};
