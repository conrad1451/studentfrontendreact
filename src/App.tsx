import FirstApp from "./FirstApp";
import Login from "./auth/Login";

function App() {
  const myChoice: number = 1;
  // const myChoice: number = 2;
  return <>{myChoice === 1 ? <FirstApp /> : <Login />}</>;
}

export default App;
