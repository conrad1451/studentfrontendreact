import DescopeLogin from "./draftAuth/CombinedDescopeAuth";
import SamplePage from "../components/SamplePage";

const Login = () => {
  const loginChoice = "Descope";
  return <>{loginChoice === "Descope" ? <DescopeLogin /> : SamplePage}</>;
};

export default Login;
