import LoginDashboard from "../../components/accountAccessPages/LoginDashboard";
import { getSessionToken } from "@descope/react-sdk"; // CHQ: suggested by Descope AI

interface DescopeUser {
  name?: string; // Assuming 'name' is a property in the user object. Adjust as needed.
  // [key: string]: any; // To allow other potential properties
}

interface LandingPageProps {
  theUser: DescopeUser;
  // theToken: string;
  theHandleLogout: () => void;
}

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

const DescopeLandingPage = (props: LandingPageProps) => {
  const sessionToken = getSessionToken();

  // const theTeacherData: UserData = JSON.parse(props.theToken);

  const theTeacherData: UserData = JSON.parse(sessionToken);
  const theTeacherID: string = theTeacherData.userId;

  return (
    <>
      {/* <p>Hello {props.theUser.name}</p> */}
      <p>Hello {props.theUser?.name}</p>{" "}
      {/* Using optional chaining in case name is not always present */}
      <div>My Private Component</div>
      {/* <LoginDashboard userID={theTeacherID} /> */}
      <LoginDashboard userID={theTeacherID} />
      {/* <FormToMongo /> */}
      <button onClick={props.theHandleLogout}>Logout</button>
    </>
  );
};

export default DescopeLandingPage;
