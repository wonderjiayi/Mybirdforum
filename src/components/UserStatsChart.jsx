import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function UserStatsChart({ audios, birds }) {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 销毁旧图
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // 统计鸟类频次
    const birdCounts = {};
    audios.forEach((a) => {
      const bird = birds.find((b) => b.id === a.birdId);
      if (bird) birdCounts[bird.name] = (birdCounts[bird.name] || 0) + 1;
    });

    const labels = Object.keys(birdCounts);
    const values = Object.values(birdCounts);

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Recordings per Bird",
            data: values,
            backgroundColor: "rgba(34, 197, 94, 0.5)",
            borderColor: "#16a34a",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { color: "#166534", font: { size: 12 } },
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, color: "#166534" },
          },
        },
      },
    });
  }, [audios, birds]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-10">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">
        📊 Bird Recording Statistics
      </h2>
      <p className="text-gray-600 mb-3">
        Visual breakdown of how many recordings per bird species this user has uploaded.
      </p>
      <canvas ref={canvasRef} className="w-full h-[300px]" />
    </div>
  );
}

export default UserStatsChart;
