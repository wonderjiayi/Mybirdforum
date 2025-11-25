import { useState, useEffect } from "react";
import { Link } from "react-router-dom";  

export default function Bird() {
  const [birds, setBirds] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/birds.json`).then(r => r.json()).then(setBirds);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Birds</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {birds.map(bird => (
          <div key={bird.id} className="bg-white shadow rounded-lg p-4 hover:shadow-lg">
            <img src={`${import.meta.env.BASE_URL}${bird.image}`} className="w-full h-40 object-cover rounded" />
            <h2 className="text-lg font-bold mt-2">{bird.name}</h2>
            <p className="text-gray-600 text-sm">{bird.habitat}</p>

            <Link
              to={`/bird/${bird.id}`}
              className="mt-3 inline-block bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
