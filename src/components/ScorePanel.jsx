function ScorePanel({ mistakes, hintsUsed, currentRoom, currentRoomIndex, totalRooms, completedRooms }) {
  const completedCount = completedRooms.length;
  const currentSolved = currentRoom ? completedRooms.includes(currentRoom.id) : false;
  const status = currentSolved ? "Afgerond" : "Actief";

  return (
    <section className="score-panel">
      <span className="panel-label">Dossierstatus</span>
      <strong>{status}</strong>
      <dl>
        <div>
          <dt>Onderzoek</dt>
          <dd>{currentRoomIndex + 1}/{totalRooms}</dd>
        </div>
        <div>
          <dt>Voortgang</dt>
          <dd>{completedCount}/{totalRooms}</dd>
        </div>
        <div>
          <dt>Fouten</dt>
          <dd>{mistakes}</dd>
        </div>
        <div>
          <dt>Hints</dt>
          <dd>{hintsUsed}</dd>
        </div>
      </dl>
    </section>
  );
}

export default ScorePanel;
