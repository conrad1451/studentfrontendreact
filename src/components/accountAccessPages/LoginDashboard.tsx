import FormToNotion from "./MyNotionForm";
import SamplePage from "../SamplePage";
// import Login from "../../auth/Login";
import FirstApp from "../../FirstApp";

const LoginDashboard = (props: { userID: string }) => {
  // const myChoice:string = "NotionForm";
  const myChoice: string = "StudentPortal";
  // const myChoice: string = "NOPE";

  return (
    <>
      {myChoice === "StudentPortal" ? (
        <FirstApp myUserID={props.userID} />
      ) : myChoice === "NotionForm" ? (
        <FormToNotion />
      ) : (
        <SamplePage />
      )}
    </>
  );
};

export default LoginDashboard;
