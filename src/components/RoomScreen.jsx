import { useState } from "react";
import EvidenceModal from "./EvidenceModal";
import EvidencePuzzle from "./EvidencePuzzle";

function RoomScreen({
  room,
  roomNumber,
  totalRooms,
  draftAnswers,
  answers,
  feedback,
  roomFeedback,
  unlockedEvidence,
  roomSolved,
  onDraftAnswer,
  onSubmitRoomCheck,
}) {
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const unlockedRoomEvidence = room.evidenceItems.filter((item) => unlockedEvidence.includes(item.id));

  return (
    <section className="room-screen">
      <header className="room-intro">
        <div>
          <span className="terminal-line">Onderzoek {roomNumber} / {totalRooms} - {room.location}</span>
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
                draftAnswer={draftAnswers[puzzle.id]}
                status={answers[puzzle.id]}
                feedback={feedback[puzzle.id]}
                evidence={evidence}
                evidenceUnlocked={unlockedEvidence.includes(puzzle.unlocksEvidenceId)}
                onDraftAnswer={onDraftAnswer}
              />
            );
          })}
        </section>
      </div>

      <footer className="room-footer">
        <section className={`room-codepad ${roomSolved ? "solved" : ""}`}>
          <div>
            <span className="panel-label">Codeslot</span>
            <h3>{roomSolved ? "Onderzoek geopend" : "Vorm het codewoord"}</h3>
            <p>
              Lees de letters van jullie ingevulde dossierkaarten en hussel ze tot een passend codewoord.
              Bewijsstukken: {unlockedRoomEvidence.length}/{room.evidenceItems.length}.
            </p>
            {roomFeedback && <p className={`feedback ${roomSolved ? "correct" : "incorrect"}`}>{roomFeedback}</p>}
          </div>
          <form className="room-code-form" onSubmit={(event) => {
            event.preventDefault();
            onSubmitRoomCheck(room.id, roomCode);
          }}>
            <label>
              Codewoord
              <input
                value={roomCode}
                onChange={(event) => setRoomCode(event.target.value)}
                placeholder="woord"
                disabled={roomSolved}
              />
            </label>
            <button className="primary-button compact" type="submit" disabled={roomSolved}>
              Open
            </button>
          </form>
        </section>
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
                <span>{unlocked ? item.type : "nog dicht"}</span>
                <strong>{unlocked ? item.inventoryLabel : "bewijs"}</strong>
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
