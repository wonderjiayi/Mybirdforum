import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

function MapSection({ onMarkerClick }) {
  const mapRef = useRef(null);
  const [birds, setBirds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filter, setFilter] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBirds, setNearbyBirds] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/data/birds.json").then((r) => r.json()),
      fetch("/data/locations.json").then((r) => r.json())
    ])
      .then(([birdsData, locationsData]) => {
        setBirds(birdsData);
        setLocations(locationsData);
        initMap(birdsData, locationsData);
      })
      .catch((err) => console.error("Error loading map data:", err));
  }, []);

  // 初始化地图
  const initMap = (birdsData, locationsData) => {
    const map = L.map(mapRef.current).setView([39.5, -98.35], 4);
    mapRef.current._leaflet_map = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    renderMap(birdsData, locationsData, map);

    // 🔹 获取用户定位
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          // 添加用户位置标记
          L.circle([latitude, longitude], {
            radius: 8000,
            color: "#22c55e",
            fillColor: "#22c55e",
            fillOpacity: 0.3
          })
            .addTo(map)
            .bindPopup("📍 You are here!");
          map.setView([latitude, longitude], 6);
          // 计算附近鸟类
          const near = findNearbyBirds(latitude, longitude, birdsData, locationsData);
          setNearbyBirds(near);
        },
        (err) => {
          console.warn("Geolocation denied or failed:", err.message);
        }
      );
    }

    return () => map.remove();
  };

  // 渲染地图图层
  const renderMap = (birdsData, locationsData, map) => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) map.removeLayer(layer);
    });

    // 🔥 热力层
    const heatPoints = locationsData.map((loc) => [loc.lat, loc.lng, loc.density]);
    L.heatLayer(heatPoints, { radius: 25, blur: 15, maxZoom: 8 }).addTo(map);

    // 📍 鸟类 marker 层
    locationsData.forEach((loc) => {
      const bird = birdsData.find((b) => b.id === loc.birdId);
      if (!bird) return;

      const icon = L.icon({
        iconUrl: bird.image,
        iconSize: [36, 36],
        className: "rounded-full border border-green-300"
      });

      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map);

// ✅ 定义 Popup 内容
const popupContent = `
  <div style="text-align:center;cursor:pointer;">
    <img src="${bird.image}" width="80" height="80"
         style="border-radius:8px;margin-bottom:4px;" />
    <h4 style="margin:0;font-size:1rem;color:#14532d;">${bird.name}</h4>
    <p style="margin:0;font-size:0.8rem;color:#555;">Habitat: ${bird.habitat}</p>
    <p style="margin:0;font-size:0.8rem;color:#777;">Density: ${loc.density}</p>
    <p style="margin:0.3rem 0 0;font-size:0.8rem;color:#15803d;font-weight:bold;">
      Click to view details →
    </p>
  </div>
`;

// ✅ 绑定 Popup
marker.bindPopup(popupContent);

// ✅ 悬停打开 / 移开关闭
marker.on("mouseover", () => marker.openPopup());
marker.on("mouseout", () => marker.closePopup());

// ✅ 点击跳转详情页
marker.on("click", () => {
  if (onMarkerClick) onMarkerClick(bird.id);
});


    });
  };

  // 🧮 计算附近鸟类（距离 < 800 km）
  const findNearbyBirds = (lat, lng, birdsData, locationsData) => {
    const R = 6371; // 地球半径 km
    const toRad = (deg) => (deg * Math.PI) / 180;

    const distances = locationsData.map((loc) => {
      const dLat = toRad(loc.lat - lat);
      const dLng = toRad(loc.lng - lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat)) * Math.cos(toRad(loc.lat)) * Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return { ...loc, distance };
    });

    const nearby = distances
      .filter((d) => d.distance < 800)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map((d) => {
        const bird = birdsData.find((b) => b.id === d.birdId);
        return { ...bird, distance: d.distance.toFixed(1) };
      });

    return nearby;
  };

  // 筛选功能
  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilter(selected);

    const filtered = selected
      ? locations.filter((loc) => {
          const bird = birds.find((b) => b.id === loc.birdId);
          return bird && bird.habitat.includes(selected);
        })
      : locations;

    renderMap(birds, filtered, mapRef.current._leaflet_map);
  };

  return (
    <section className="mt-16 px-8 pb-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-2xl font-bold text-green-800 mb-3 sm:mb-0">
            🗺️ Bird Habitat Distribution
          </h2>
          <select
            className="border border-green-300 rounded-lg p-2 text-green-800 focus:ring-2 focus:ring-green-300"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="">All Habitats</option>
            <option value="Forest">Forest</option>
            <option value="Wetland">Wetland</option>
            <option value="Urban">Urban</option>
            <option value="Coastal">Coastal</option>
            <option value="Grassland">Grassland</option>
          </select>
        </div>

        {/* 🪶 附近鸟类推荐框 */}
        {userLocation && nearbyBirds.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <h3 className="text-green-800 font-semibold mb-1">🪶 Nearby Birds</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {nearbyBirds.map((b, i) => (
                <li key={i}>
                  <span className="font-medium text-green-700">{b.name}</span> — {b.distance} km away
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-gray-600 mb-5">
          Explore the density of bird populations across regions. The heatmap shows where sightings
          are most frequent. You can filter by habitat or view species near your current location.
        </p>

        <div
          ref={mapRef}
          className="h-[480px] w-full rounded-xl border border-green-100 shadow-inner"
        ></div>
      </div>
    </section>
  );
}

export default MapSection;
