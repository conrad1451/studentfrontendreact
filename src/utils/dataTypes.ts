// dataTypes.ts
export interface RowPage {
  myID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Major: string;
  // Major: string | null;

  // CreatedTime: Date;
  // EditedTime: Date;
}

// export interface StudentRecord {
//   id: number;
//   FirstName: string;
//   LastName: string;
//   Email: string;
//   Major: string;
//   // EnrollmentDate: string;
// }

export interface StudentRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  major: string;
  // major: string | null;
  enrollment_date?: string;
}

export interface Item {
  id: number;
  value: string;
}

export interface FoodItem {
  id: number;
  value: string;
}

export interface QtyItem {
  id: number;
  value: number;
}

// export interface QtyItem {
//   id?: number;
//   value: number;
// }

export interface ProcessedLine {
  id: string; // Unique ID for React key
  text: string;
  qty: number;
  matchedItem: FoodItem | null; // The matched food item
  originalMatchConfidence?: number; // Optional: confidence score for matching
}

export interface TextProcessorProps {
  foodItems: FoodItem[]; // The list of all available food items from MyTable
  onProcessedLinesChange: (lines: ProcessedLine[]) => void; // Callback to pass processed lines to parent
  // onDataStructure: (theData: Map<string, string[]>) => void;
}
