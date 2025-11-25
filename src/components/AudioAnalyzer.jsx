import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import SpectrogramPlugin from "wavesurfer.js/dist/plugins/spectrogram.esm.js";

/**
 * AudioAnalyzer 组件
 * 展示频谱图 + 能量分析条
 */
function AudioAnalyzer({ fileUrl }) {
  const containerRef = useRef(null);
  const spectrogramContainer = useRef(null);
  const energyCanvasRef = useRef(null);
  const waveSurferRef = useRef(null);

  // 🌈 自动生成256级绿色渐变
  function generateColorMap() {
    const start = [224, 255, 244];
    const end = [5, 100, 40];
    const steps = 256;
    const map = [];
    for (let i = 0; i < steps; i++) {
      const r = Math.round(start[0] + (end[0] - start[0]) * (i / (steps - 1)));
      const g = Math.round(start[1] + (end[1] - start[1]) * (i / (steps - 1)));
      const b = Math.round(start[2] + (end[2] - start[2]) * (i / (steps - 1)));
      map.push([r / 255, g / 255, b / 255, 1]);
    }
    return map;
  }

  useEffect(() => {
    if (!fileUrl) return;

    if (waveSurferRef.current) {
      waveSurferRef.current.destroy();
    }

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#a7f3d0",
      progressColor: "#16a34a",
      height: 80,
      barWidth: 2,
      cursorWidth: 1,
      normalize: true,
      interact: false,
    });

    const spectrogram = SpectrogramPlugin.create({
      container: spectrogramContainer.current,
      labels: true,
      fftSamples: 512,
      height: 180,
      colorMap: generateColorMap(),
    });

    wavesurfer.registerPlugin(spectrogram);
    wavesurfer.load(fileUrl);

    waveSurferRef.current = wavesurfer;

    // ⚡ 实时能量绘制
    const canvas = energyCanvasRef.current;
    const ctx = canvas.getContext("2d");

    function drawEnergy(progress) {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#dcfce7";
      ctx.fillRect(0, 0, width, height);

      // 模拟波动感
      const energy = Math.sin(progress * Math.PI * 2) ** 2;

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#22c55e");
      gradient.addColorStop(1, "#166534");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, height * (1 - energy), width, height * energy);
    }

    // 实时更新能量条
    wavesurfer.on("audioprocess", (currentTime) => {
      const progress = currentTime / wavesurfer.getDuration();
      drawEnergy(progress);
    });

    // ✅ 自动播放（静音，仅用于能量分析）
    wavesurfer.on("ready", () => {
      wavesurfer.setVolume(0);
      wavesurfer.play();
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [fileUrl]);

  return (
    <div className="mt-8 space-y-6">
      {/* 🌊 波形 */}
      <div
        ref={containerRef}
        className="w-full h-[80px] bg-green-50 border border-green-200 rounded-lg"
      ></div>

      {/* 🔬 频谱 */}
      <div
        ref={spectrogramContainer}
        className="w-full h-[180px] bg-green-50 border border-green-200 rounded-lg"
      ></div>

      {/* ⚡ 能量分析图 */}
      <div className="relative w-full h-24 bg-white border border-green-200 rounded-lg overflow-hidden">
        <canvas
          ref={energyCanvasRef}
          width={600}
          height={100}
          className="w-full h-full"
        ></canvas>
        <div className="absolute top-2 left-4 text-sm text-green-800 font-semibold">
          🔋 Energy Analysis
        </div>
      </div>
    </div>
  );
}

export default AudioAnalyzer;
