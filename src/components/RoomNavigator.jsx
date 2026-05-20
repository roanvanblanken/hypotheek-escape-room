import { isQuestionFilled } from "../utils/answerCheckers";

function roomHasFilledDraft(room, draftAnswers) {
  return room.puzzles?.length > 0 && room.puzzles.every((puzzle) => isQuestionFilled(puzzle, draftAnswers[puzzle.id]));
}

function RoomNavigator({
  rooms,
  currentRoomIndex,
  showOverview,
  completedRooms,
  unlockedRooms,
  draftAnswers = {},
  onSelectRoom,
  onShowOverview,
}) {
  return (
    <nav className="room-navigator" aria-label="Onderzoeksdossier">
      <div className="nav-heading">
        <span className="panel-label">Onderzoeken</span>
        <button
          className={`ghost-button compact overview-nav-button ${showOverview ? "active" : ""}`}
          type="button"
          onClick={onShowOverview}
        >
          Overzicht onderzoek {currentRoomIndex + 1}
        </button>
      </div>
      <ol>
        {rooms.map((room, index) => {
          const unlocked = unlockedRooms.includes(room.id);
          const completed = completedRooms.includes(room.id);
          const active = index === currentRoomIndex && !showOverview;
          const filled = !completed && unlocked && roomHasFilledDraft(room, draftAnswers);
          const status = !unlocked ? "Vergrendeld" : completed ? "Afgerond" : active ? "Actief" : filled ? "Ingevuld" : "Beschikbaar";

          return (
            <li key={room.id}>
              <button
                className={`${active ? "active" : ""} ${completed ? "completed" : ""} ${filled ? "filled" : ""}`}
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectRoom(index)}
              >
                <span>{index + 1}</span>
                <strong>{room.shortTitle}</strong>
                <small>{status}</small>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default RoomNavigator;
