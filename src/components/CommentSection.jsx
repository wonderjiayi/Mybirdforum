import { useState, useEffect } from "react";

// ⏰ 格式化时间为“几分钟前”
const formatTime = (timestamp) => {
  const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

function CommentSection({ audioId, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 🔹 加载评论与用户信息
  useEffect(() => {
    Promise.all([
      fetch("/data/comments.json").then((r) => r.json()),
      fetch("/data/users.json").then((r) => r.json()),
    ])
      .then(([commentData, userData]) => {
        const filtered = commentData.filter((c) => c.audioId === Number(audioId));
        setComments(filtered);
        setUsers(userData);
        onCountChange?.(filtered.length); // ✅ 初次统计数量
      })
      .catch((err) => console.error("Error loading comments:", err));
  }, [audioId]);

  // 🔹 提交评论
  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const fakeUser =
      users[0] || { id: 999, name: "Guest", avatar: "/images/default-avatar.png" };

    const newItem = {
      id: comments.length + 1,
      audioId: Number(audioId),
      userId: fakeUser.id,
      content: newComment,
      parentId: null,
      createdAt: new Date().toISOString(),
    };

    const updated = [...comments, newItem];
    setComments(updated);
    setNewComment("");
    onCountChange?.(updated.length); // ✅ 数量更新
  };

  // 🔹 提交回复
  const handleReply = (parentId) => {
    const text = prompt("Reply to this comment:");
    if (text && text.trim()) {
      const fakeUser =
        users[1] || { id: 888, name: "BirdLover", avatar: "/images/default-avatar.png" };
      const reply = {
        id: comments.length + 1,
        audioId: Number(audioId),
        userId: fakeUser.id,
        content: text,
        parentId,
        createdAt: new Date().toISOString(),
      };
      const updated = [...comments, reply];
      setComments(updated);
      onCountChange?.(updated.length);
    }
  };

  // 🔹 递归渲染评论树
  const renderComment = (comment, depth = 0) => {
    const user =
      users.find((u) => u.id === comment.userId) || {
        name: "Anonymous",
        avatar: "/images/default-avatar.png",
      };

    const replies = comments.filter((c) => c.parentId === comment.id);

    return (
      <div
        key={comment.id}
        className={`flex gap-3 mb-4 ${
          depth > 0 ? "ml-10 border-l border-green-100 pl-4" : ""
        }`}
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full border border-green-200 object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-green-800">{user.name}</p>
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-xs text-gray-400">{formatTime(comment.createdAt)}</p>

          {depth < 2 && (
            <button
              onClick={() => handleReply(comment.id)}
              className="text-green-700 text-xs hover:underline mt-1"
            >
              Reply
            </button>
          )}

          {replies.length > 0 && (
            <div className="mt-2">
              {replies.map((r) => renderComment(r, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-inner">
      {/* 💬 评论列表 */}
      <div className="mb-6">
        {comments.length > 0 ? (
          comments
            .filter((c) => c.parentId === null)
            .map((c) => renderComment(c))
        ) : (
          <p className="text-gray-500 italic">No comments yet — be the first!</p>
        )}
      </div>

      {/* ✍️ 评论输入框 */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-green-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default CommentSection;
