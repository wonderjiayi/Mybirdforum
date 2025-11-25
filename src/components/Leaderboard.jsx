import { useState, useEffect } from "react";

function Leaderboard() {
  const [likes, setLikes] = useState([]);
  const [birds, setBirds] = useState([]);
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/data/likes.json").then((r) => r.json()),
      fetch("/data/birds.json").then((r) => r.json()),
      fetch("/data/audios.json").then((r) => r.json())
    ])
      .then(([likesData, birdsData, audiosData]) => {
        setLikes(likesData);
        setBirds(birdsData);
        setAudios(audiosData);
      })
      .catch((err) => console.error("Error loading leaderboard:", err));
  }, []);

  // 统计每个 audioId 被点赞的次数
  const likeCountMap = likes.reduce((acc, like) => {
    acc[like.audioId] = (acc[like.audioId] || 0) + 1;
    return acc;
  }, {});

  // 映射 audioId -> birdId
  const getBirdByAudio = (audioId) => {
    const audio = audios.find((a) => a.id === audioId);
    if (!audio) return null;
    return birds.find((b) => b.id === audio.birdId);
  };

  // 排序取前五
  const sorted = Object.entries(likeCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([audioId, count]) => {
      const bird = getBirdByAudio(Number(audioId));
      return { ...bird, count };
    });

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-xl font-bold text-green-800 mb-4">🏆 Top Liked Birds</h2>
      {sorted.map((b, i) => (
        <div
          key={b?.id || i}
          className="flex items-center space-x-3 py-3 hover:bg-green-50 rounded-xl transition"
        >
          <span className="text-lg font-semibold text-green-700 w-6">{i + 1}.</span>
          <img
            src={b?.image}
            alt={b?.name}
            className="w-10 h-10 rounded-full object-cover border border-green-200"
          />
          <div>
            <p className="font-medium">{b?.name || "Unknown"}</p>
            <p className="text-sm text-gray-500">❤️ {b?.count} likes</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
