import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function FeaturedCarousel() {
  const [birds, setBirds] = useState([]);
  const [audios, setAudios] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // 加载鸟类和音频数据
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/birds.json`)
      .then((res) => res.json())
      .then((data) => setBirds(data.slice(0, 5)));

    fetch(`${import.meta.env.BASE_URL}data/audios.json`)
      .then((res) => res.json())
      .then((data) => setAudios(data));
  }, []);

  // 自动轮播（除非暂停）
  useEffect(() => {
    if (!birds.length || paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % birds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [birds, paused]);

  // 切换时停止音频
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [index]);

  if (!birds.length) return null;

  const bird = birds[index];
  const audio = audios.find((a) => a.birdId === bird.id);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className="relative bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-md p-8 mb-10 max-w-4xl mx-auto transition-all duration-500"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex flex-col items-center text-center cursor-pointer transition-all hover:scale-[1.02]"
        onClick={() => navigate(`/birds/${bird.id}`)}
      >
        <img
          src={bird.image}
          alt={bird.name}
          className="w-48 h-48 object-cover rounded-full shadow-lg border-4 border-green-300"
        />
        <h2 className="text-2xl font-bold text-green-800 mt-4">{bird.name}</h2>
        <p className="italic text-gray-600">{bird.scientificName}</p>
        <p className="text-gray-700 mt-2 max-w-md">{bird.description}</p>
      </div>

      {/* 播放按钮 */}
      <div className="flex justify-center mt-4">
        {audio && (
          <>
            <audio ref={audioRef} src={audio.fileUrl}></audio>
            <button
              onClick={handlePlayPause}
              className="mt-2 px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition"
            >
              {isPlaying ? "⏸️ Pause" : "🎵 Play Sound"}
            </button>
          </>
        )}
      </div>

      {/* 圆点指示 */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
        {birds.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? "bg-green-700 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default FeaturedCarousel;
