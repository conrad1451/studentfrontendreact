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
