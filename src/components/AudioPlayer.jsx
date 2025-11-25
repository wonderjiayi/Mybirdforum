function AudioPlayer({ fileUrl }) {
  return (
    <audio
      controls
      src={fileUrl}
      className="w-48 h-8 rounded-lg shadow-sm border border-green-200"
    >
      Your browser does not support the audio element.
    </audio>
  );
}

export default AudioPlayer;
