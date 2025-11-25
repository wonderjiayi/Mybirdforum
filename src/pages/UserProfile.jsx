import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";
import UserMap from "../components/UserMap";
import UserStatsChart from "../components/UserStatsChart";


/**
 * 用户个人主页
 * 包含三个主要区域：
 * 1️⃣ 用户信息栏（头像、简介、关注数）
 * 2️⃣ Tab 切换：Uploads / Favorites / Following
 * 3️⃣ 内容卡片区
 */
function UserProfile() {
  const { id } = useParams();
  console.log('User ID from params:', id);  

  
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [audios, setAudios] = useState([]);
  const [likes, setLikes] = useState([]);
  const [birds, setBirds] = useState([]);
  const [activeTab, setActiveTab] = useState("uploads");

  useEffect(() => {
    Promise.all([
      fetch("/data/users.json").then((r) => r.json()),
      fetch("/data/audios.json").then((r) => r.json()),
      fetch("/data/likes.json").then((r) => r.json()),
      fetch("/data/birds.json").then((r) => r.json())
    ])
      .then(([usersData, audiosData, likesData, birdsData]) => {
        setUsers(usersData);
        setAudios(audiosData);
        setLikes(likesData);
        setBirds(birdsData);
        const foundUser = usersData.find((u) => u.id === Number(id));
        setUser(foundUser);
      })
      .catch((err) => console.error("Error loading profile data:", err));
  }, [id]);

  if (!user)
    return (
      <div className="text-center text-gray-500 mt-20 text-lg">
        Loading user profile...
      </div>
    );

  // 用户上传的录音
  const userAudios = audios.filter((a) => Number(a.uploader) === user.id);

  // 用户收藏（点赞）的音频
  const likedAudios = likes
    .filter((l) => l.userId === user.id)
    .map((l) => audios.find((a) => a.id === l.audioId))
    .filter(Boolean);

  // 用户关注的人
  const followingList = users.filter((u) =>
    user.followingIds?.includes(u.id)
  );

  // 切换标签按钮样式
  const tabClass = (tab) =>
    `px-5 py-2 rounded-full text-sm font-medium transition ${
      activeTab === tab
        ? "bg-green-600 text-white shadow-md"
        : "bg-green-100 text-green-700 hover:bg-green-200"
    }`;

  return (
    <div className="min-h-screen bg-green-50 py-10 px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        {/* 🔙 返回按钮 */}
        <button
          onClick={() => navigate(-1)}
          className="text-green-700 hover:underline mb-6"
        >
          ← Back
        </button>

        {/* 🧑 用户信息栏 */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          <img
            src={user.avatar || "/images/default-avatar.png"}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-green-200 shadow-md"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-green-800">{user.name}</h1>
            <p className="text-gray-600 italic">
              {user.bio || "No bio available."}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              📍 {user.location || "Unknown"} · Joined{" "}
              {user.joined
                ? new Date(user.joined).toLocaleDateString()
                : "N/A"}
            </p>
            <div className="flex justify-center sm:justify-start gap-6 mt-4 text-green-700 font-medium">
              <span>🎧 {userAudios.length} uploads</span>
              <span>❤️ {likedAudios.length} favorites</span>
              <span>👥 {user.followingIds?.length || 0} following</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow">
            ✏️ Edit Profile
          </button>
        </div>

        {/* 🧭 Tabs 切换栏 */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-8">
          <button className={tabClass("uploads")} onClick={() => setActiveTab("uploads")}>
            My Uploads
          </button>
          <button className={tabClass("favorites")} onClick={() => setActiveTab("favorites")}>
            Favorites
          </button>
          <button className={tabClass("following")} onClick={() => setActiveTab("following")}>
            Following
          </button>
        </div>

        {/* 🎧 Uploads Tab */}
        {activeTab === "uploads" && (
          <div>
            {userAudios.length === 0 ? (
              <p className="text-gray-500 italic text-center">No uploads yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAudios.map((audio) => {
                  const bird = birds.find((b) => b.id === audio.birdId);
                  return (
                    <div
                      key={audio.id}
                      className="bg-green-50 rounded-2xl p-4 shadow-sm hover:shadow-lg transition cursor-pointer"
                      onClick={() => navigate(`/audio/${audio.id}`)}
                    >
                      <img
                        src={bird?.image}
                        alt={bird?.name}
                        className="w-full h-40 object-cover rounded-xl mb-3"
                      />
                      <h3 className="font-semibold text-green-800 mb-1">
                        {bird?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {audio.fileUrl.split("/").pop()}
                      </p>
                      <AudioPlayer fileUrl={audio.fileUrl} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ❤️ Favorites Tab */}
        {activeTab === "favorites" && (
          <div>
            {likedAudios.length === 0 ? (
              <p className="text-gray-500 italic text-center">
                No favorites yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedAudios.map((audio) => {
                  const bird = birds.find((b) => b.id === audio.birdId);
                  return (
                    <div
                      key={audio.id}
                      className="bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer"
                      onClick={() => navigate(`/audio/${audio.id}`)}
                    >
                      <img
                        src={bird?.image}
                        alt={bird?.name}
                        className="w-full h-40 object-cover rounded-t-2xl"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-green-800 mb-1">
                          {bird?.name}
                        </h3>
                        <p className="text-sm text-gray-500 italic">
                          {audio.fileUrl.split("/").pop()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 🪶 Following Tab */}
        {activeTab === "following" && (
          <div>
            {followingList.length === 0 ? (
              <p className="text-gray-500 italic text-center">
                Not following anyone yet.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {followingList.map((f) => (
                  <div
                    key={f.id}
                    className="text-center cursor-pointer hover:scale-[1.03] transition"
                    onClick={() => navigate(`/users/${f.id}`)}
                  >
                    <img
                      src={f.avatar}
                      alt={f.name}
                      className="w-20 h-20 mx-auto rounded-full border border-green-200 object-cover shadow-sm mb-2"
                    />
                    <p className="font-medium text-green-800">{f.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* 🌍 用户录音地图 */}
{userAudios.some((a) => a.location) && (
  <UserMap audios={userAudios} birds={birds} />
)}

{/* 📊 录音统计图表 */}
{userAudios.length > 0 && (
  <UserStatsChart audios={userAudios} birds={birds} />
)}

    </div>
  );
}

export default UserProfile;
