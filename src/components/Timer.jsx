function formatTime(totalSeconds) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const seconds = Math.max(0, totalSeconds) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function Timer({ secondsRemaining }) {
  const urgent = secondsRemaining <= 180;

  return (
    <div className={`timer ${urgent ? "urgent" : ""}`} aria-label="Resterende tijd">
      <span className="panel-label">Timer</span>
      <strong>{formatTime(secondsRemaining)}</strong>
    </div>
  );
}

export default Timer;
