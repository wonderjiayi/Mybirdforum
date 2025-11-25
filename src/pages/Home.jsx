import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Leaderboard from "../components/Leaderboard";
import MapSection from "../components/MapSection";
import AudioPlayer from "../components/AudioPlayer";

function Home() {
  const [birds, setBirds] = useState([]);
  const [likes, setLikes] = useState([]);
  const [audios, setAudios] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // 载入所有 JSON 数据
  useEffect(() => {
    Promise.all([
      fetch("/data/birds.json").then((res) => res.json()),
      fetch("/data/audios.json").then((res) => res.json()),
      fetch("/data/likes.json").then((res) => res.json()),
      fetch("/data/users.json").then((res) => res.json()),
    ])
      .then(([birdsData, audiosData, likesData, usersData]) => {
        setBirds(birdsData);
        setAudios(audiosData);
        setLikes(likesData);
        setUsers(usersData);
      })
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  // 🧮 计算排行榜（按点赞数排序）
  const getLikeCount = (birdId) =>
    likes.filter((like) => {
      const audio = audios.find((a) => a.id === like.audioId);
      return audio && audio.birdId === birdId;
    }).length;

  const leaderboard = birds
    .map((bird) => ({
      ...bird,
      likeCount: getLikeCount(bird.id),
    }))
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5);

  // 📥 获取最新上传的音频
 const latestAudios = [...audios]
  .sort((a, b) => b.id - a.id)
  .slice(0, 5)
  .map((audio) => ({
    ...audio,
    uploaderId: audio.uploader, // 保留原始ID
    uploaderData: users.find((u) =>Number(u.id) ===Number(audio.uploader))|| {
      name: "Anonymous",
      avatar: "/images/default-avatar.png",
    },
  }));

  // 🔍 搜索过滤鸟类
  const filteredBirds = birds.filter((bird) =>
    bird.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🧠 获取排行榜点击跳转
  const handleBirdClick = (birdId) => {
    navigate(`/birds/${birdId}`);
  };

  // 🧠 获取音频详情跳转
  const handleAudioClick = (audioId) => {
    navigate(`/audio/${audioId}`);
  };

  // 🧠 获取轮播展示的精选鸟类（可自定义挑选）
  const featuredBirds = birds.slice(0, 4);

  return (
    <div className="min-h-screen bg-green-50">
      

      {/* 🟢 顶部全屏轮播 + 搜索框 */}
      <section className="relative w-full h-[50vh] overflow-hidden">
        {featuredBirds.map((bird, index) => (
          <div
            key={bird.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === 0 ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={bird.image}
              alt={bird.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 via-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <h1 className="text-5xl font-bold mb-3 drop-shadow-lg">
                {bird.name}
              </h1>
              <p className="mb-4 italic text-lg opacity-90">
                {bird.habitat || "No habitat info"}
              </p>
              <AudioPlayer fileUrl={bird.sampleAudio || ""} />
              <button
                onClick={() => navigate(`/birds/${bird.id}`)}
                className="mt-5 bg-green-600 px-6 py-2 rounded-full hover:bg-green-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* 搜索框（固定在底部中心） */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <input
            type="text"
            placeholder="🔍 Search birds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 px-5 rounded-full border border-green-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </section>

      {/* 🟢 主体内容区：左侧榜单 + 最新上传，右侧鸟卡 */}
      <main className="max-w-7xl mx-auto mt-12 flex flex-col lg:flex-row gap-10 px-6">

        {/* 左栏 */}
        <div className="lg:w-[340px] flex-shrink-0 space-y-8">

          {/* 🏆 Top Liked Birds */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              🏆 Top Liked Birds
            </h2>
            <ul className="space-y-3">
              {leaderboard.map((bird, idx) => (
                <li
                  key={bird.id}
                  onClick={() => handleBirdClick(bird.id)}
                  className="flex items-center gap-4 cursor-pointer hover:bg-green-50 p-2 rounded-xl transition"
                >
                  <span className="text-green-700 font-bold w-5">
                    {idx + 1}.
                  </span>
                  <img
                    src={bird.image}
                    alt={bird.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div>
                    <p className="font-medium">{bird.name}</p>
                    <p className="text-sm text-gray-500">
                      ❤️ {bird.likeCount} likes
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

         {/* 📥 Latest Uploads */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              📥 Latest Uploads
            </h2>
            <ul className="space-y-3">
              {latestAudios.map((audio) => (
                <li
                  key={audio.id}
                  onClick={() => handleAudioClick(audio.id)}
                  className="flex items-center gap-4 cursor-pointer hover:bg-green-50 p-2 rounded-xl transition"
                >
                  <img
                    src={audio.uploaderData.avatar}
                    alt={audio.uploaderData.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-green-800">{audio.uploaderData.name}</p>
                    <p className="text-sm text-gray-500 italic">
                      {audio.fileUrl.split("/").pop()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
         </div>

        {/* 右栏 Explore Birds */}
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
            🐦 Explore Birds
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBirds.map((bird) => (
              <div
                key={bird.id}
                onClick={() => handleBirdClick(bird.id)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition cursor-pointer overflow-hidden"
              >
                <img
                  src={bird.image}
                  alt={bird.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-800">
                    {bird.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Habitat: {bird.habitat}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 🗺️ Map Section */}
      <section className="mt-16 mb-10 px-6">
        <MapSection onMarkerClick={(birdId) => navigate(`/birds/${birdId}`)} />

      </section>
    </div>
  );
}

export default Home;
