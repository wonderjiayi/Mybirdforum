import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/users.json")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const handleLogin = () => {
    const foundUser = users.find(
      (u) => u.name.toLowerCase() === username.toLowerCase()
    );

    if (!foundUser) {
      alert("User not found!");
      return;
    }

    // 保存到 localStorage
    localStorage.setItem("currentUserId", foundUser.id);

    // 跳转到 /users/:id
    navigate(`/users/${foundUser.id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-900">
          Fake Login
        </h1>

        <input
          className="w-full border px-4 py-2 rounded mb-4"
          placeholder="Enter username (case-insensitive)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
