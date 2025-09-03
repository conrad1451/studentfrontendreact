// useColumnVisibility.test.ts

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useColumnVisibility,
  ColumnVisibility,
  //   ColumnPresetName,
} from "../../src/hooks/useColumnVisibility";

// Define the expected default and preset visibility settings directly in the test file
// This makes tests independent of the internal structure of visibilitySettings Map,
// focusing on the public API's output.
// const defaultColumnVisibility: ColumnVisibility = {
//   Name: true,
//   Status: true,
//   Level: false,
//   Source: true,
//   DateFound: true,
//   DayPosted: false,
//   ApplicationDeadline: false,
//   DateApplied: true,
//   ExpireDate: true,
//   PostingURL: true,
//   Connection: false,
//   State: false,
//   Setup: false,
//   Company: false,
//   Education: false,
//   Duties: false,
//   Tags: true,
//   Tenure: false,
//   Location: false,
//   PageURL: true,
// };

// import type {
//   defaultColumnVisibility,
//   smartphoneVisibility,
// } from "../../src/hooks/useColumnVisibility";

// const smartphoneVisibility: ColumnVisibility = {
//   Name: true,
//   Status: true,
//   Level: false,
//   Source: false,
//   DateFound: true,
//   DayPosted: false,
//   ApplicationDeadline: false,
//   DateApplied: false,
//   ExpireDate: false,
//   PostingURL: false,
//   Connection: false,
//   State: false,
//   Setup: false,
//   Company: true,
//   Education: false,
//   Duties: true,
//   Tags: true,
//   Tenure: false,
//   Location: false,
//   PageURL: true,
// };

const defaultColumnVisibility: ColumnVisibility = {
  myID: true,
  FirstName: true,
  LastName: true,
  Email: true,
  Major: true,
};

const smartphoneVisibility: ColumnVisibility = {
  myID: false,
  FirstName: true,
  LastName: false,
  Email: true,
  Major: true,
};
describe("useColumnVisibility", () => {
  // Test case 1: Initial state without an initial preset key
  it("should initialize with default column visibility when no initial preset is provided", () => {
    const { result } = renderHook(() => useColumnVisibility());
    expect(result.current.visibleColumns).toEqual(defaultColumnVisibility);
  });

  // Test case 3: Toggling individual column visibility
  it("should toggle column visibility correctly", () => {
    const { result } = renderHook(() => useColumnVisibility());

    // Toggle 'Email' from false to true
    act(() => {
      result.current.handleToggleColumn({
        target: { name: "Email", checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.visibleColumns.FirstName).toBe(true);
    expect(result.current.visibleColumns.LastName).toBe(true); // Ensure other columns remain unchanged
    expect(result.current.visibleColumns.Major).toBe(true); // Ensure other columns remain unchanged
    // expect(result.current.visibleColumns.myID).toBe(true); // Ensure other columns remain unchanged

    // Toggle 'FirstName' from true to false
    act(() => {
      result.current.handleToggleColumn({
        target: { name: "FirstName", checked: false },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.visibleColumns.Email).toBe(true);
    expect(result.current.visibleColumns.LastName).toBe(true); // Ensure other columns remain unchanged
    expect(result.current.visibleColumns.Major).toBe(true); // Ensure other columns remain unchanged
  });

  // Test case 5: Resetting visibility to default
  it("should reset column visibility to default", () => {
    const { result } = renderHook(() => useColumnVisibility("smartphone")); // Start with a non-default preset

    // Verify it's not default initially
    expect(result.current.visibleColumns).toEqual(smartphoneVisibility);
    expect(result.current.visibleColumns).not.toEqual(defaultColumnVisibility);

    // Reset visibility
    act(() => {
      result.current.resetVisibility();
    });

    // Verify it's back to default
    expect(result.current.visibleColumns).toEqual(defaultColumnVisibility);
  });
});
