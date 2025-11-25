import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

function BirdMap({ bird, recordings, users }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !recordings?.length) return;

    // 清理旧地图
    if (mapRef.current._leaflet_map) {
      mapRef.current._leaflet_map.remove();
    }

    // 初始化地图（聚焦录音点中心）
    const avgLat =
      recordings.reduce((sum, a) => sum + a.location.lat, 0) / recordings.length;
    const avgLng =
      recordings.reduce((sum, a) => sum + a.location.lng, 0) / recordings.length;

    const map = L.map(mapRef.current).setView([avgLat, avgLng], 5);
    mapRef.current._leaflet_map = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // 添加热力层
    const points = recordings.map((a) => [a.location.lat, a.location.lng, 0.5]);
    L.heatLayer(points, {
      radius: 25,
      blur: 15,
      gradient: { 0.3: "#bbf7d0", 0.6: "#4ade80", 1: "#166534" },
    }).addTo(map);

    // 添加录音标记
    recordings.forEach((audio) => {
      const uploader =
        users.find((u) => Number(u.id) === Number(audio.uploader)) || {};
      const icon = L.icon({
        iconUrl: bird.image,
        iconSize: [36, 36],
        className: "rounded-full border border-green-400",
      });

      const popupContent = `
        <div style="text-align:center">
          <h4 style="margin:0;color:#166534;font-weight:600;">${bird.name}</h4>
          <p style="margin:4px 0;font-size:0.9rem;color:#555;">
            ${uploader.name || "Anonymous"} · ${new Date(audio.uploadedAt).toLocaleDateString()}
          </p>
          <button id="play-${audio.id}"
            style="background:#16a34a;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;">
            ▶ Play sample
          </button>
        </div>
      `;

      const marker = L.marker([audio.location.lat, audio.location.lng], { icon })
        .addTo(map)
        .bindPopup(popupContent);

      marker.on("popupopen", () => {
        const btn = document.getElementById(`play-${audio.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            const audioEl = new Audio(audio.fileUrl);
            audioEl.play();
          });
        }
      });
    });

    return () => map.remove();
  }, [bird, recordings, users]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-10">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">
        🗺️ Habitat Distribution
      </h2>
      <p className="text-gray-600 mb-4">
        Explore all known recording locations for{" "}
        <span className="font-medium text-green-800">{bird.name}</span>. Click
        on markers to hear local samples.
      </p>
      <div
        ref={mapRef}
        className="h-[450px] w-full rounded-xl border border-green-100 shadow-inner"
      ></div>
    </div>
  );
}

export default BirdMap;
