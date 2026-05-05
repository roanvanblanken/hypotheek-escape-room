function ProgressMap({ rooms, currentRoomIndex, completedRooms }) {
  return (
    <nav className="progress-map" aria-label="Kamervoortgang">
      <span className="panel-label">Kluisroute</span>
      <ol>
        {rooms.map((room, index) => {
          const completed = completedRooms.includes(room.id);
          const active = index === currentRoomIndex;

          return (
            <li
              className={`${completed ? "completed" : ""} ${active ? "active" : ""}`}
              key={room.id}
            >
              <span>{index + 1}</span>
              <p>{room.shortTitle}</p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ProgressMap;
