import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("currentUserId");
    if (!id) return;

    fetch(`${import.meta.env.BASE_URL}data/users.json`)
      .then((res) => res.json())
      .then((users) => setCurrentUser(users.find((u) => u.id === Number(id))));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUserId");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold">BirdForum</Link>

      <div className="flex gap-8 text-lg items-center">
        <Link to="/">Home</Link>
        <Link to="/birds">Birds</Link>
        <Link to="/upload">Upload</Link>
        


        {/* 如果没登录，则显示 Login */}
        {!currentUser && (
          <button
            onClick={() => navigate("/login")}
            className="hover:underline"
          >
            Login
          </button>
        )}

        {/* 登录后显示头像 */}
        {currentUser && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(`/users/${currentUser.id}`)}
          >
            <img
              src={currentUser.avatar || "/images/default-avatar.png"}
              className="w-8 h-8 rounded-full border"
            />
            <span>{currentUser.name}</span>
            <button
              className="ml-2 text-sm text-red-200 hover:text-red-400"
              onClick={handleLogout}
            >
              (logout)
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
