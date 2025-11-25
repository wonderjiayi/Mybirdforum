import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LatestUploads() {
  const [audios, setAudios] = useState([]);
  const [birds, setBirds] = useState([]);
  const [users, setUsers] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("/data/audios.json").then((r) => r.json()),
      fetch("/data/birds.json").then((r) => r.json()),
      fetch("/data/users.json").then((r) => r.json())
    ])
      .then(([audiosData, birdsData, usersData]) => {
        const sorted = audiosData
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
          .slice(0, 5);
        setAudios(sorted);
        setBirds(birdsData);
        setUsers(usersData);
      })
      .catch((err) => console.error("Error loading latest uploads:", err));
  }, []);

  const getBirdName = (birdId) =>
    birds.find((x) => x.id === birdId)?.name || "Unknown Bird";

  const getUserName = (userId) =>
    users.find((x) => Number(x.id) === Number(userId))?.name || "Anonymous";

  const getUserAvatar = (userId) =>
    users.find((x) => Number(x.id) === Number(userId))?.avatar || "/images/default-avatar.png";

  const handlePlayToggle = (audio) => {
    if (playingId === audio.id) {
      // 如果当前音频正在播放 → 暂停
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      // 停止上一个音频
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // 播放新音频
      const newAudio = new Audio(audio.fileUrl);
      newAudio.play();
      audioRef.current = newAudio;
      setPlayingId(audio.id);

      // 当播放完毕时，重置状态
      newAudio.onended = () => setPlayingId(null);
    }
  };

  const handleClick = (birdId) => {
    navigate(`/birds/${birdId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mt-6">
      <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
        📥 Latest Uploads
      </h2>

      {audios.map((audio) => (
        <div
          key={audio.id}
          onClick={() => handleClick(audio.birdId)}
          className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-green-50 rounded-xl transition cursor-pointer group"
        >
          {/* 左侧：头像 + 鸟名 + 上传者 */}
          <div className="flex items-center space-x-3">
            <img
              src={getUserAvatar(audio.uploader)}
              alt={getUserName(audio.uploader)}
              className="w-8 h-8 rounded-full object-cover border border-green-100"
            />
            <div>
              <p className="font-medium text-green-800 group-hover:text-green-900 transition">
                {getBirdName(audio.birdId)}
              </p>
              <p className="text-xs text-gray-500">
                by {getUserName(audio.uploader)}
              </p>
            </div>
          </div>

          {/* 右侧：播放按钮 + 日期 */}
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation(); // 阻止点击跳转
                handlePlayToggle(audio);
              }}
              className={`px-2 py-1 border border-green-200 rounded-md transition ${
                playingId === audio.id
                  ? "bg-green-200 text-green-900"
                  : "text-green-700 hover:bg-green-100"
              }`}
              title={playingId === audio.id ? "Pause" : "Play"}
            >
              {playingId === audio.id ? "⏸" : "▶"}
            </button>

            <p className="text-xs text-gray-400">
              {new Date(audio.uploadedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LatestUploads;
