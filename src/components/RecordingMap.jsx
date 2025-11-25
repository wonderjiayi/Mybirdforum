import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

function RecordingMap({ bird, audio }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!audio?.location) return;

    // 初始化地图
    const map = L.map(mapRef.current).setView(
      [audio.location.lat, audio.location.lng],
      6
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // 添加当前录音点
    const icon = L.icon({
      iconUrl: bird?.image || "/images/default-bird.jpg",
      iconSize: [40, 40],
      className: "rounded-full border border-green-400",
    });

    const marker = L.marker([audio.location.lat, audio.location.lng], { icon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align:center">
          <img src="${bird?.image}" width="80" height="80" style="border-radius:10px;margin-bottom:4px;" />
          <h4 style="margin:0;font-size:1rem;color:#14532d;">${bird?.name}</h4>
          <p style="margin:0;font-size:0.8rem;">${audio.location.city}</p>
          <p style="margin:0;font-size:0.8rem;color:#777;">${new Date(audio.uploadedAt).toLocaleDateString()}</p>
        </div>
      `);

    // 平滑弹出 popup
    marker.openPopup();

    // 可选：加载该鸟类其他录音热力图
    fetch("/data/audios.json")
      .then((r) => r.json())
      .then((data) => {
        const points = data
          .filter((a) => a.birdId === bird.id && a.location)
          .map((a) => [a.location.lat, a.location.lng, 0.6]);
        if (points.length > 1) {
          L.heatLayer(points, {
            radius: 25,
            blur: 20,
            gradient: { 0.3: "#86efac", 0.7: "#22c55e", 1: "#14532d" },
          }).addTo(map);
        }
      });

    return () => map.remove();
  }, [bird, audio]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">
        📍 Recording Location
      </h2>
      <div
        ref={mapRef}
        className="h-[400px] w-full rounded-xl border border-green-100 shadow-inner"
      ></div>
    </div>
  );
}

export default RecordingMap;
