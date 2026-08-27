import Navbar from "./components/Navbar";
import Card from "./components/Card";
import Login from "./components/login";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      {user ? <Card /> : <Login />}
    </>
  );
}

export default App;