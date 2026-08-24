import { useState, useEffect } from "react";
import API from "./services/api";
import type { User } from "./types/User";
import UserCard from "./components/Card";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await API.get("/users");
        setUsers(response.data);
      } catch (err) {
        setError("Something went wrong while fetching users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-white text-2xl font-semibold animate-pulse">
          Loading...
        </h1>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-red-500 text-center text-xl font-semibold">
          {error}
        </h1>
      </div>
    );

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <h1 className="mb-10 text-center text-4xl font-extrabold tracking-tight text-white">
        Users List
      </h1>

      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default App;