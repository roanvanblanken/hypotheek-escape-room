import EvidenceBoard from "./EvidenceBoard";
import Inventory from "./Inventory";
import RoomNavigator from "./RoomNavigator";
import ScorePanel from "./ScorePanel";
import Timer from "./Timer";

function GameLayout({
  children,
  currentRoomIndex,
  rooms,
  secondsRemaining,
  mistakes,
  hintsUsed,
  completedRooms,
  unlockedRooms,
  unlockedEvidence,
  onSelectRoom,
  onShowOverview,
  onReset,
  muted,
  onToggleMute,
}) {
  return (
    <main className="game-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">De Hypotheekkluis</p>
          <h1>Onderzoeksruimte</h1>
        </div>
        <div className="topbar-controls">
          <button className="icon-button" type="button" onClick={onToggleMute} aria-label="Geluid dempen">
            {muted ? "Muted" : "Audio"}
          </button>
          <button className="ghost-button" type="button" onClick={onReset}>
            Reset
          </button>
        </div>
      </header>

      <section className="escape-grid">
        <aside className="left-rail">
          <RoomNavigator
            rooms={rooms}
            currentRoomIndex={currentRoomIndex}
            completedRooms={completedRooms}
            unlockedRooms={unlockedRooms}
            onSelectRoom={onSelectRoom}
            onShowOverview={onShowOverview}
          />
        </aside>

        <section className="room-stage">{children}</section>

        <aside className="right-rail">
          <Timer secondsRemaining={secondsRemaining} />
          <ScorePanel
            secondsRemaining={secondsRemaining}
            mistakes={mistakes}
            hintsUsed={hintsUsed}
          />
          <Inventory rooms={rooms} unlockedEvidence={unlockedEvidence} />
          <EvidenceBoard
            rooms={rooms}
            unlockedEvidence={unlockedEvidence}
            completedRooms={completedRooms}
          />
          <div className="audio-placeholder">
            <span className="panel-label">Audio placeholder</span>
            <p>Later: kluisdeur, terminalpiep, tikklok en dossierprinter.</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default GameLayout;
