// useTableSorting.test.ts

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableSorting } from "../../src/hooks/useTableSorting"; // Adjust path as needed

// --- Interfaces
interface RowPage {
  myID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Major: string;
}

// --- Mock Data ---
const mockRowPages: RowPage[] = [
  {
    myID: 1,
    FirstName: "Samuel",
    LastName: "Quartey",
    Email: "samuel.quartey@rice.edu",
    Major: "Computer Science",
  },
  {
    myID: 2,
    FirstName: "Tyler",
    LastName: "Mensah",
    Email: "tyler.mensah@vanderbilt.edu",
    Major: "Engineering Science",
  },
  {
    myID: 3,
    FirstName: "Jonathan",
    LastName: "Yang",
    Email: "jonathan.yang@rice.edu",
    Major: "Electrical Engineering",
  },
  {
    myID: 4,
    FirstName: "Sue",
    LastName: "Lee",
    Email: "sue.lee@vanderbilt.edu",
    Major: "Computer Science",
  },
  {
    myID: 5,
    FirstName: "Jackson",
    LastName: "Unger",
    Email: "jackson.unger@tufts.edu",
    Major: "Political Science",
  },
  {
    myID: 6,
    FirstName: "Molly",
    LastName: "Abraham",
    Email: "molly.abraham@tufts.edu",
    Major: "Chemical Engineering",
  },
  {
    myID: 7,
    FirstName: "Jackary",
    LastName: "Hansen",
    Email: "jackary.hansen@yale.edu",
    Major: "Political Science",
  },
  {
    myID: 8,
    FirstName: "Jacklyn",
    LastName: "Abrahams",
    Email: "jacklyn.abrahams@yale.edu",
    Major: "Chemical Engineering",
  },
];

describe("useTableSorting", () => {
  // Test Case 1: Initial state
  it("should initialize with no active sort and return data in original order", () => {
    const { result } = renderHook(() => useTableSorting(mockRowPages));

    expect(result.current.sortProps.sortColumn).toBeNull();
    expect(result.current.sortProps.sortDirection).toBeNull();

    // Verify that the sortedData is initially the same as the input filteredData
    expect(result.current.sortedData).toEqual(mockRowPages);
  });

  // Test Case 2: Name Sorting
  describe("Email Sorting", () => {
    it("should sort by email", () => {
      // it("should sort by Name in ascending order", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleSort("Email");
      });

      expect(result.current.sortProps.sortDirection).not.toBeNull();
    });

    it("should reset Name sort", () => {
      const { result } = renderHook(() => useTableSorting(mockRowPages));

      act(() => {
        result.current.sortHandlers.handleSort("Email");
      });
      expect(result.current.sortProps.sortDirection).toBe("asc");

      act(() => {
        result.current.sortHandlers.resetSort();
      });
      expect(result.current.sortProps.sortDirection).toBeNull();
      // Should return to the original order (as no other sort is active)
      expect(result.current.sortedData).toEqual(mockRowPages);
    });
  });

  // Test Case 3: Handling empty or single-item data
  it("should handle empty data gracefully", () => {
    const { result } = renderHook(() => useTableSorting([]));
    expect(result.current.sortedData).toEqual([]);
    act(() => {
      result.current.sortHandlers.handleSort("FirstName");
    });
    expect(result.current.sortedData).toEqual([]);
  });

  // Test Case 4: Handling empty or single-item data
  it("should handle single-item data gracefully", () => {
    const singlePage = [mockRowPages[0]];
    const { result } = renderHook(() => useTableSorting(singlePage));
    expect(result.current.sortedData).toEqual(singlePage);
    act(() => {
      result.current.sortHandlers.handleSort("LastName");
    });
    expect(result.current.sortedData).toEqual(singlePage);
  });
});
