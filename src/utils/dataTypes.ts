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

export interface DescopeUser {
  name: string;
  email: string;
  roleNames?: string[]; // The `roleNames` property is an optional array of strings
}
export interface StudentRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  major: string;
  // major: string | null;
  enrollment_date?: string;
}

// CHQ: Gemini AI generated interface UserData
export interface UserData {
  loginsIds: string[];
  userId: string;
  userNames: {
    name: string;
    email: string;
    phone: string;
    verifiedEmail: boolean;
    verifiedPhone: boolean;
    roleNames: string[];
    logins: any[];
  }[];
  userTenants: any[];
  status: string;
  OAuth: {
    google: boolean;
  };
  SAML: boolean;
  SCIM: boolean;
  TOTP: boolean;
  createTime: number;
  customAttributes: {};
  email: string;
  externalIds: string[];
  familyName: string;
  givenName: string;
  loginIds: string[];
  middleName: string;
  password: boolean;
  phone: string;
  picture: string;
  roleNames: string[];
  ssoIds: any[];
  test: boolean;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  webauthn: boolean;
}
export interface Item {
  id: number;
  value: string;
}

// --- WebFormProps & WebForm Component ---
export interface WebFormProps {
  onSubmit: (event: React.FormEvent) => Promise<void>;
}

export interface ConfirmUpdateProps {
  first_name: string;
  last_name: string;
  email: string;
  major: string;
}

export interface ApiResponse {
  message: string;
  // ... other properties
}

export interface TableBodyRowsProps {
  data: RowPage[];
  visibleColumns: ColumnVisibilityMiniTable;
  theColumnKeys: Array<keyof ColumnVisibilityMiniTable>;
  onOpenActionModal: (student: RowPage) => void;
  // NEW PROPS - passed down from StudentTable
  myId: number;
  myFirstName: string;
  setMyFirstName: (value: string) => void;
  myLastName: string;
  setMyLastName: (value: string) => void;
  myEmail: string;
  setMyEmail: (value: string) => void;
  myMajor: string;
  setMyMajor: (value: string) => void;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  onNewStudentSubmit: (event: React.FormEvent) => Promise<void>;
}
export interface ColumnVisibility {
  myID: boolean;
  FirstName: boolean;
  LastName: boolean;
  Email: boolean;
  Major: boolean;
}
export interface ColumnVisibilityMiniTable {
  myID: boolean;
  FirstName: boolean;
  Qty: boolean;
  LastName: boolean;
  Email: boolean;
  Major: boolean;
}

export const allColumnKeys: Array<keyof ColumnVisibility> = [
  "myID",
  "FirstName",
  "LastName",
  "Email",
  "Major",
];
