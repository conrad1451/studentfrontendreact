import type { RowPage } from "./dataTypes";

export const idGenerator = (rawTableData: RowPage[]) => {
  // CHQ: Gemini AI added following logic to calculate new ID
  // --- Logic to determine the new myID ---
  const maxId = rawTableData.reduce((max, row) => {
    const currentId = row.myID; // Assuming myID is already a number
    return isNaN(currentId) ? max : Math.max(max, currentId);
  }, 0); // Start with 0 if no valid IDs found
  return maxId + 1;
};
