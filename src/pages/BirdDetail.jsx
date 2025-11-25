import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AudioPlayer from "../components/AudioPlayer";
import BirdMap from "../components/BirdMap";


function BirdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bird, setBird] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [users, setUsers] = useState([]);
  const [relatedBirds, setRelatedBirds] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/birds.json`).then((r) => r.json()),
      fetch(`${import.meta.env.BASE_URL}data/audios.json`).then((r) => r.json()),
      fetch(`${import.meta.env.BASE_URL}data/users.json`).then((r) => r.json()),
    ])
      .then(([birdsData, audiosData, usersData]) => {
        const foundBird = birdsData.find((b) => b.id === Number(id));
        setBird(foundBird);
        const relatedAudios = audiosData.filter((a) => a.birdId === Number(id));
        setRecordings(relatedAudios);
        setUsers(usersData);

        // 推荐三只 habitat 相同的鸟
        const related = birdsData
          .filter((b) => b.habitat === foundBird.habitat && b.id !== foundBird.id)
          .slice(0, 3);
        setRelatedBirds(related);
      })
      .catch((err) => console.error("Error loading bird detail:", err));
  }, [id]);

  if (!bird)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">Loading bird info...</p>
    );

  const getUploader = (uid) => {
    const user = users.find((u) => Number(u.id) === Number(uid));
    return user
      ? { name: user.name, avatar: `${import.meta.env.BASE_URL}${user.avatar}` }
      : { name: "Anonymous", avatar:  `${import.meta.env.BASE_URL}images/default-avatar.png`};
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        {/* 🏞️ Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-green-700 hover:underline"
          >
            ← Back to list
          </button>
          <span className="text-sm text-gray-500 italic">
            Scientific Name: <span className="text-green-700">{bird.latinName || bird.scientificName}</span>
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <img
            src={`${import.meta.env.BASE_URL}${bird.image}`}
            alt={bird.name}
            className="w-full lg:w-1/2 h-80 object-cover rounded-2xl shadow-md"
          />

          <div className="flex-1">
            <h1 className="text-4xl font-bold text-green-800 mb-2">{bird.name}</h1>
            <p className="text-green-700 bg-green-100 inline-block px-3 py-1 rounded-full mb-3">
              Habitat: {bird.habitat}
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              {bird.description || "No description available."}
            </p>
            <p className="text-sm text-gray-500 italic">
              “Listen closely, and you can almost feel the environment they live in.”
            </p>
          </div>
        </div>

        {/* 🎧 Recordings */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            🎧 Recordings of {bird.name}
          </h2>

          {recordings.length === 0 ? (
            <p className="text-gray-500 italic">No recordings available for this bird.</p>
          ) : (
            <div className="space-y-4">
              {recordings.map((audio) => {
                const uploader = getUploader(audio.uploader);
                return (
                  <div
                    key={audio.id}
                    className="p-5 bg-green-50 rounded-2xl shadow-sm hover:shadow-lg transition flex flex-col md:flex-row justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={uploader.avatar}
                        alt={uploader.name}
                        className="w-10 h-10 rounded-full border border-green-200 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-green-800">
                          🎵 {audio.fileUrl.split("/").pop()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded by{" "}
                          <span className="text-green-700 font-medium">
                            {uploader.name}
                          </span>{" "}
                          ·{" "}
                          {new Date(audio.uploadedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 md:mt-0">
                      <AudioPlayer fileUrl={`${import.meta.env.BASE_URL}${audio.fileUrl}`} />
                      <button
                        onClick={() => navigate(`/audio/${audio.id}`)}
                        className="text-sm px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 🗺️ 地图部分 */}
{recordings.some((r) => r.location) && (
  <BirdMap
    bird={{
      ...bird,
      image: `${import.meta.env.BASE_URL}${bird.image}`,
    }}
    recordings={recordings.map((r) => ({
      ...r,
      fileUrl: `${import.meta.env.BASE_URL}${r.fileUrl}`,
    }))}
    users={users.map((u) => ({
      ...u,
      avatar: `${import.meta.env.BASE_URL}${u.avatar}`,
    }))}
  />
)}



        {/* 🌍 Related Birds */}
        {relatedBirds.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              🌿 Related Species
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBirds.map((b) => (
                <div
                  key={b.id}
                  onClick={() => navigate(`/birds/${b.id}`)}
                  className="cursor-pointer bg-white border border-green-100 hover:shadow-lg transition rounded-2xl overflow-hidden"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${b.image}`}
                    alt={b.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-green-800">
                      {b.name}
                    </h4>
                    <p className="text-sm text-gray-500 italic">{b.habitat}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BirdDetail;
