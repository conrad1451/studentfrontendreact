// useTableFilters.test.ts

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTableFilters } from "../../src/hooks/useTableFilters"; // Adjust path as needed
// import { SelectChangeEvent } from "@mui/material/Select"; // For Material-UI Select events

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

describe("useTableFilters", () => {
  // Test Case 1: Initial state
  it("should initialize all filters to their default off/empty states", () => {
    const { result } = renderHook(() => useTableFilters(mockRowPages));

    expect(result.current.filterProps.isFirstNameFilterEnabled).toBe(false);
    expect(result.current.filterProps.firstnameFilterText).toBe("");

    expect(result.current.filterProps.isLastNameFilterEnabled).toBe(false);
    expect(result.current.filterProps.lastnameFilterText).toBe("");

    expect(result.current.filterProps.isMajorFilterEnabled).toBe(false);
    expect(result.current.filterProps.majorFilterText).toBe("");

    // Initially, filteredData should be all initialData
    expect(result.current.filteredData.length).toBe(mockRowPages.length);
    expect(result.current.filteredData).toEqual(mockRowPages);
  });

  // Test Case 2: Page Name Filter
  describe("Page Name Filter", () => {
    it("should filter by page name when enabled and text is provided", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      act(() => {
        result.current.filterHandlers.toggleFirstNameFilter(); // Enable
        result.current.filterHandlers.setFirstNameFilterText("Samuel");
      });

      expect(result.current.filterProps.isFirstNameFilterEnabled).toBe(true);
      expect(result.current.filterProps.firstnameFilterText).toBe("Samuel");
      expect(result.current.filteredData.length).toBe(1);
      expect(result.current.filteredData[0].FirstName).toBe("Samuel");
    });

    it("should ignore filter when disabled", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      // Enable and set text, then disable
      act(() => {
        result.current.filterHandlers.toggleFirstNameFilter();
        result.current.filterHandlers.setFirstNameFilterText("Molly");
        result.current.filterHandlers.toggleFirstNameFilter(); // Disable
      });

      expect(result.current.filterProps.isFirstNameFilterEnabled).toBe(false);
      expect(result.current.filterProps.firstnameFilterText).toBe(""); // Should be reset
      expect(result.current.filteredData.length).toBe(mockRowPages.length); // Should show all data
    });

    // CHQ: Gemini AI claimed this test was redundant
    // it("should reset page filter text when toggled off", () => {
    //   const { result } = renderHook(() => useTableFilters(mockRowPages));

    //   act(() => {
    //     result.current.filterHandlers.togglePageFilter();
    //     result.current.filterHandlers.setPageFilterText("engineer");
    //   });
    //   expect(result.current.filterProps.pageFilterText).toBe("engineer");

    //   act(() => {
    //     result.current.filterHandlers.togglePageFilter(); // Toggle off
    //   });
    //   expect(result.current.filterProps.pageFilterText).toBe("");
    //   expect(result.current.filterProps.isPageFilterEnabled).toBe(false);
    //   expect(result.current.filteredData.length).toBe(mockRowPages.length);
    // });

    it("should reset page filter using resetFirstNameFilters handler", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      act(() => {
        result.current.filterHandlers.toggleFirstNameFilter();
        result.current.filterHandlers.setFirstNameFilterText("Jack");
      });
      expect(result.current.filterProps.firstnameFilterText).toBe("Jack");
      expect(result.current.filterProps.isFirstNameFilterEnabled).toBe(true);
      expect(result.current.filteredData.length).toBe(3); // Jackson, Jackary, Jacklyn

      act(() => {
        result.current.filterHandlers.resetFirstNameFilters();
      });
      expect(result.current.filterProps.firstnameFilterText).toBe("");
      expect(result.current.filterProps.isFirstNameFilterEnabled).toBe(false);
      expect(result.current.filteredData.length).toBe(mockRowPages.length);
    });
  });

  // Test Case 6: Combined Filters
  describe("Combined Filters", () => {
    it("should apply multiple filters simultaneously", () => {
      const { result } = renderHook(() => useTableFilters(mockRowPages));

      act(() => {
        // First name filter
        result.current.filterHandlers.toggleFirstNameFilter();
        result.current.filterHandlers.setFirstNameFilterText("Jack"); // Jackson, Jackary, Jackylyn

        // Last name filter
        result.current.filterHandlers.toggleLastNameFilter();
        result.current.filterHandlers.setLastNameFilterText("Abraham"); // Molly Abraham, Jacklyn Abrahams

        // Major filter
        result.current.filterHandlers.toggleMajorFilter();
        result.current.filterHandlers.setMajorFilterText("Chemical");
      });

      // Expected intersection: Only Frontend Engineer should remain
      // Initial: All 6
      // After Page Name: Frontend, Backend, QA, DevOps (4)
      // After Tag (React): Frontend (1)
      // After Status (Applied): Frontend (1) - as Frontend is the only one "Applied" and "React" and "Engineer"
      expect(result.current.filteredData.length).toBe(1);
      // expect(result.current.filteredData[0].Name).toBe("Frontend Engineer");

      // act(() => {
      //   // Now try adding another tag that "Frontend Engineer" also has
      //   result.current.filterHandlers.handleTagNameChange({
      //     value: "TypeScript",
      //   });
      // });
      // expect(result.current.filteredData.length).toBe(1); // Still Frontend Engineer

      // act(() => {
      //   // Add a tag that Frontend Engineer does NOT have, should result in no matches
      //   result.current.filterHandlers.handleTagNameChange({ value: "Node.js" });
      // });
      // expect(result.current.filteredData.length).toBe(0); // No job has "Frontend" AND "React" AND "TypeScript" AND "Node.js"
    });

    // it("should correctly reset all filters by calling individual reset handlers", () => {
    //   const { result } = renderHook(() => useTableFilters(mockRowPages));

    //   act(() => {
    //     // Apply various filters
    //     result.current.filterHandlers.togglePageFilter();
    //     result.current.filterHandlers.setPageFilterText("e");

    //     result.current.filterHandlers.toggleTagFilter();
    //     result.current.filterHandlers.handleTagNameChange({ value: "Python" });

    //     result.current.filterHandlers.toggleStatusFilter();
    //     result.current.filterHandlers.handleStatusChange({ value: "Applied" });

    //     result.current.filterHandlers.handleTagCountChange({
    //       target: { value: 3 },
    //     } as SelectChangeEvent<number | string>);
    //   });

    //   // Verify filters are applied
    //   expect(result.current.filteredData.length).toBeLessThan(
    //     mockRowPages.length
    //   );

    //   act(() => {
    //     // Reset all filters individually
    //     result.current.filterHandlers.resetPageFilters();
    //     result.current.filterHandlers.resetTagFilters();
    //     result.current.filterHandlers.resetStatusFilters();
    //     result.current.filterHandlers.resetTagCountFilters();
    //     result.current.filterHandlers.resetCompanyFilters(); // Add these too if they were implicitly set by tests
    //     result.current.filterHandlers.resetTenureFilters();
    //     result.current.filterHandlers.resetSetupFilters();
    //   });

    //   // All data should be visible again
    //   expect(result.current.filterProps.isPageFilterEnabled).toBe(false);
    //   expect(result.current.filterProps.pageFilterText).toBe("");
    //   expect(result.current.filterProps.tagNameList).toEqual([]);
    //   expect(result.current.filterProps.statusSelected).toBe("");
    //   expect(result.current.filterProps.tagCountFilter).toBe("");
    //   expect(result.current.filteredData.length).toBe(mockRowPages.length);
    //   expect(result.current.filteredData).toEqual(mockRowPages);
    // });
  });
});
