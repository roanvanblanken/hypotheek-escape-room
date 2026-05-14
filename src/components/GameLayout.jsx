import HintDesk from "./HintDesk";
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
  visibleHints,
  onSelectRoom,
  onShowOverview,
  onShowHint,
  onReset,
  muted,
  onToggleMute,
}) {
  return (
    <main className="game-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">De Hypotheekcheck</p>
          <h1>Herstel het adviesdossier</h1>
        </div>
        <div className="topbar-controls">
          <button className="icon-button" type="button" onClick={onToggleMute} aria-label="Geluid dempen">
            {muted ? "Stil" : "Audio"}
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
          <HintDesk
            visibleHints={visibleHints}
            onShowHint={onShowHint}
            secondsRemaining={secondsRemaining}
          />
        </aside>
      </section>
    </main>
  );
}

export default GameLayout;
