import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

function AudioWavePlayer({ fileUrl }) {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    // 初始化 wavesurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#a7f3d0",      // 浅绿色波形
      progressColor: "#16a34a",  // 深绿色进度条
      cursorColor: "#065f46",
      height: 80,
      barWidth: 2,
      responsive: true,
    });

    wavesurferRef.current.load(fileUrl);

    return () => {
      wavesurferRef.current.destroy();
    };
  }, [fileUrl]);

  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
    setIsPlaying(wavesurferRef.current.isPlaying());
  };

  return (
    <div className="w-full">
      <div ref={waveformRef} className="w-full h-[100px] mb-4"></div>
      <button
        onClick={handlePlayPause}
        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>
    </div>
  );
}

export default AudioWavePlayer;
