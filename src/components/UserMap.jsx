import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

function UserMap({ audios, birds }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || audios.length === 0) return;

    if (mapRef.current._leaflet_map) mapRef.current._leaflet_map.remove();

    const validAudios = audios.filter((a) => a.location);
    if (validAudios.length === 0) return;

    const avgLat =
      validAudios.reduce((sum, a) => sum + a.location.lat, 0) /
      validAudios.length;
    const avgLng =
      validAudios.reduce((sum, a) => sum + a.location.lng, 0) /
      validAudios.length;

    const map = L.map(mapRef.current).setView([avgLat, avgLng], 5);
    mapRef.current._leaflet_map = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // 🔥 热力图层
    const heatPoints = validAudios.map((a) => [
      a.location.lat,
      a.location.lng,
      0.5,
    ]);
    L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      gradient: { 0.3: "#bbf7d0", 0.6: "#4ade80", 1: "#166534" },
    }).addTo(map);

    // 📍 标记点 + popup 播放
    validAudios.forEach((audio) => {
      const bird = birds.find((b) => b.id === audio.birdId);
      const popup = `
        <div style="text-align:center;">
          <h4 style="margin:0;color:#166534;">${bird?.name || "Unknown"}</h4>
          <p style="font-size:0.85rem;color:#555;">${
            audio.location.city || "Unknown"
          }</p>
          <button id="play-${audio.id}" style="background:#16a34a;color:white;border:none;padding:4px 8px;border-radius:6px;cursor:pointer;">▶ Play</button>
        </div>
      `;

      const marker = L.marker([audio.location.lat, audio.location.lng]).addTo(map);
      marker.bindPopup(popup);

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
  }, [audios, birds]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-10">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">
        🗺️ Recording Locations
      </h2>
      <p className="text-gray-600 mb-3">
        Explore where this user recorded bird songs around the world.
      </p>
      <div
        ref={mapRef}
        className="h-[400px] w-full rounded-xl border border-green-100 shadow-inner"
      ></div>
    </div>
  );
}

export default UserMap;
