function RoomNavigator({ rooms, currentRoomIndex, completedRooms, unlockedRooms, onSelectRoom, onShowOverview }) {
  return (
    <nav className="room-navigator" aria-label="Onderzoeksdossier">
      <div className="nav-heading">
        <span className="panel-label">Onderzoeken</span>
        <button className="ghost-button compact" type="button" onClick={onShowOverview}>
          Overzicht
        </button>
      </div>
      <ol>
        {rooms.map((room, index) => {
          const unlocked = unlockedRooms.includes(room.id);
          const completed = completedRooms.includes(room.id);
          const active = index === currentRoomIndex;

          return (
            <li key={room.id}>
              <button
                className={`${active ? "active" : ""} ${completed ? "completed" : ""}`}
                type="button"
                disabled={!unlocked}
                onClick={() => onSelectRoom(index)}
              >
                <span>{index + 1}</span>
                <strong>{room.shortTitle}</strong>
                <small>{unlocked ? (completed ? "afgerond" : "open") : "nog dicht"}</small>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default RoomNavigator;
