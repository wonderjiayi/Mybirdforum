import { useState } from "react";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Upload feature coming soon!");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Bird Audio</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning Sparrow"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
