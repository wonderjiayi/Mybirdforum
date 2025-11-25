import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AudioPlayer from "../components/AudioPlayer";
import MapSection from "../components/MapSection"; // 将来用于录音点地图
import { Heart } from "lucide-react";
import AudioWavePlayer from "../components/AudioWavePlayer";
import AudioAnalyzer from "../components/AudioAnalyzer";
import CommentSection from "../components/CommentSection";
import RecordingMap from "../components/RecordingMap";



function AudioDetail() {
  const { id } = useParams(); // 从URL获取音频id
  const navigate = useNavigate();

  const [audio, setAudio] = useState(null);
  const [bird, setBird] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);


  // 加载数据
  useEffect(() => {
    Promise.all([
      fetch("/data/audios.json").then((r) => r.json()),
      fetch("/data/birds.json").then((r) => r.json()),
      fetch("/data/users.json").then((r) => r.json()),
      fetch("/data/likes.json").then((r) => r.json()),
    ])
      .then(([audioData, birdsData, usersData, likesData]) => {
        const current = audioData.find((a) => String(a.id) === id);
        if (!current) return;

        const currentBird = birdsData.find((b) => b.id === current.birdId);
        const currentUser = usersData.find(
          (u) => Number(u.id) === Number(current.uploader)
        );
        const audioLikes = likesData.filter((l) => l.audioId === current.id);

        setAudio(current);
        setBird(currentBird);
        setUploader(currentUser);
        setLikes(audioLikes);
      })
      .catch((err) => console.error("Error loading data:", err));
  }, [id]);

  // 点赞逻辑（本地模拟）
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) =>
      isLiked ? prev.slice(0, -1) : [...prev, { userId: 999, audioId: audio.id }]
    );
  };

 if (!audio || !bird || !uploader) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-green-800">
      <div className="animate-pulse text-2xl font-semibold">Loading audio details...</div>
      <div className="mt-3 w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      {/* 🧭 面包屑导航 */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-600">
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer text-green-700 hover:underline"
        >
          Home
        </span>{" "}
        / <span>{bird.name}</span> / <span className="font-semibold">Audio #{audio.id}</span>
      </div>

      {/* 🎵 标题与上传信息 */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-green-900 mb-1">
              {bird.name} — Birdsong Recording
            </h1>
            <p className="text-gray-600 italic mb-3">
              Uploaded by <span className="font-medium text-green-800">{uploader.name}</span> on{" "}
              {new Date(audio.uploadedAt).toLocaleDateString()}
            </p>
          </div>

          {/* ❤️ 点赞区 */}
          <div className="flex items-center gap-2">
  <button
    onClick={handleLike}
    className={`p-2 rounded-full relative group transition-transform duration-300 ${
      isLiked
        ? "bg-green-100 text-green-700 scale-110"
        : "bg-gray-100 text-gray-600 hover:scale-105"
    }`}
  >
    <Heart
      size={26}
      fill={isLiked ? "#16a34a" : "none"}
      className={`transition-all duration-300 ${
        isLiked ? "animate-pingOnce" : ""
      }`}
    />
    {isLiked && (
      <span className="absolute -top-3 -right-3 text-green-500 animate-bounce">
        +1
      </span>
    )}
  </button>
  <span className="text-green-800 font-medium">{likes.length}</span>
</div>

        </div>
      </section>

      {/* 🎧 播放器与分析区 */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-10">
  <h2 className="text-2xl font-semibold text-green-800 mb-4">🎧 Audio Player</h2>
  <AudioWavePlayer fileUrl={audio.fileUrl} />
  <p className="text-gray-600 mt-3">
    File: <span className="font-mono">{audio.fileUrl.split("/").pop()}</span>
  </p>

  {/* 🎵 实时频谱 + 能量图 */}
  <AudioAnalyzer fileUrl={audio.fileUrl} />
</section>
      {/* 🧍 上传者信息 */}
      <section className="max-w-6xl mx-auto bg-green-50 border border-green-200 rounded-2xl p-6 mb-10 flex items-center gap-4">
        <img
          src={uploader.avatar}
          alt={uploader.name}
          className="w-16 h-16 rounded-full border border-green-300 object-cover"
        />
        <div>
          <p className="font-semibold text-green-800 text-lg">{uploader.name}</p>
          <p className="text-sm text-gray-600">Passionate bird lover & contributor</p>
        </div>
      </section>

      {/* 🪶 鸟类关联卡 */}
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-10 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={bird.image}
          alt={bird.name}
          className="w-48 h-48 rounded-xl object-cover shadow-sm"
        />
        <div>
          <h2 className="text-2xl font-semibold text-green-900 mb-2">{bird.name}</h2>
          <p className="text-gray-600 mb-3 italic">{bird.habitat}</p>
          <p className="text-gray-700 mb-4">
            Discover more recordings and details about this bird species.
          </p>
          <button
            onClick={() => navigate(`/birds/${bird.id}`)}
            className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
          >
            View Bird Details →
          </button>
        </div>
      </section>

     {/* 🗺️ 录音地点 */}
<section className="max-w-6xl mx-auto mb-10">
  <RecordingMap bird={bird} audio={audio} />
</section>


      {/* 💬 评论区 */}
<section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-16">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-semibold text-green-800 flex items-center gap-2">
      💬 Comments
      <span className="text-green-600 text-lg">({commentCount})</span>
    </h2>
  </div>

  {/* 评论区主体 */}
  <CommentSection audioId={audio.id} onCountChange={setCommentCount} />
</section>

    </div>
  );
}

export default AudioDetail;
