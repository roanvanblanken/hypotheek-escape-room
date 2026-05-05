import { useState } from "react";
import EvidenceModal from "./EvidenceModal";
import EvidencePuzzle from "./EvidencePuzzle";
import RoomCodePad from "./RoomCodePad";

function RoomScreen({
  room,
  roomNumber,
  totalRooms,
  answers,
  feedback,
  visibleHints,
  unlockedEvidence,
  roomSolved,
  onSubmitAnswer,
  onShowHint,
  onSubmitRoomCode,
}) {
  const [activeEvidence, setActiveEvidence] = useState(null);
  const unlockedRoomEvidence = room.evidenceItems.filter((item) => unlockedEvidence.includes(item.id));

  return (
    <section className="room-screen">
      <header className="room-intro">
        <div>
          <span className="terminal-line">Kamer {roomNumber} / {totalRooms} - {room.location}</span>
          <h2>{room.title}</h2>
          <p>{room.subtitle}</p>
        </div>
        <p className="atmosphere">{room.atmosphere}</p>
      </header>

      <div className="room-workbench">
        <section className="room-visual" aria-label="Kamerbeeld">
          <div className="vault-window">
            <span>{room.shortTitle}</span>
          </div>
          <div className="side-panel-stack">
            {room.sidePanels.map((panel) => (
              <article className={`object-panel ${panel.kind}`} key={panel.title}>
                <span className="panel-label">{panel.kind}</span>
                <h3>{panel.title}</h3>
                {panel.body ? (
                  <p>{panel.body}</p>
                ) : (
                  <table>
                    <tbody>
                      {panel.rows.map(([label, value]) => (
                        <tr key={label}>
                          <th>{label}</th>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="terminal-stack" aria-label="Puzzelhandelingen">
          {room.puzzles.map((puzzle) => {
            const evidence = room.evidenceItems.find((item) => item.id === puzzle.unlocksEvidenceId);

            return (
              <EvidencePuzzle
                key={puzzle.id}
                puzzle={puzzle}
                status={answers[puzzle.id]}
                feedback={feedback[puzzle.id]}
                hintVisible={visibleHints.includes(puzzle.id)}
                evidence={evidence}
                evidenceUnlocked={unlockedEvidence.includes(puzzle.unlocksEvidenceId)}
                onSubmit={onSubmitAnswer}
                onShowHint={onShowHint}
              />
            );
          })}
        </section>
      </div>

      <footer className="room-footer">
        <RoomCodePad
          room={room}
          solved={roomSolved}
          evidenceCount={unlockedRoomEvidence.length}
          totalEvidence={room.evidenceItems.length}
          onSubmitCode={onSubmitRoomCode}
        />
        <div className="mini-evidence-rail" aria-label="Bewijsstukken in deze kamer">
          {room.evidenceItems.map((item) => {
            const unlocked = unlockedEvidence.includes(item.id);

            return (
              <button
                className={unlocked ? "unlocked" : ""}
                key={item.id}
                type="button"
                disabled={!unlocked}
                onClick={() => setActiveEvidence({ ...item, roomTitle: room.shortTitle })}
              >
                <span>{unlocked ? item.type : "locked"}</span>
                <strong>{unlocked ? item.title : "Verborgen bewijsstuk"}</strong>
              </button>
            );
          })}
        </div>
      </footer>
      <EvidenceModal item={activeEvidence} onClose={() => setActiveEvidence(null)} />
    </section>
  );
}

export default RoomScreen;
