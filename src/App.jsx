import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BirdDetail from "./pages/BirdDetail";
import AudioDetail from "./pages/AudioDetail";
import UserProfile from "./pages/UserProfile";
import Login from "./pages/Login";
import Bird from "./pages/Bird";
import Upload from "./pages/Upload";

function RedirectProfile() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem("currentUserId");
    if (id) navigate(`/users/${id}`);
    else navigate("/login");
  }, []);

  return null;
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/birds" element={<Bird />} />
        <Route path="/bird/:id" element={<BirdDetail />} />
        <Route path="/audio/:id" element={<AudioDetail />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />

        {/* 动态用户主页 */}
        <Route path="/users/:id" element={<UserProfile />} />

        {/* profile 自动跳转 */}
        <Route path="/profile" element={<RedirectProfile />} />
      </Routes>
    </>
  );
}

export default App;
