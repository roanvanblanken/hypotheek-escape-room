import { useState } from "react";
import EvidencePuzzle from "./EvidencePuzzle";

function RoomScreen({
  room,
  roomNumber,
  totalRooms,
  draftAnswers,
  answers,
  feedback,
  roomFeedback,
  roomSolved,
  fiftyFiftyUsedPuzzleIds = [],
  fiftyFiftyOptionsByPuzzle = {},
  fiftyFiftyBlockedSeconds = 0,
  onDraftAnswer,
  onSubmitRoomCheck,
  onUseFiftyFifty,
}) {
  const [roomCode, setRoomCode] = useState("");
  const [advice, setAdvice] = useState("");
  const isAdviceRoom = room.type === "advice";
  const hasEscapeCode = Boolean(room.escapeCode);
  const hasSupportPanels = room.sidePanels?.length > 0;

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

      <div className={`room-workbench ${isAdviceRoom ? "advice-workbench" : ""} ${hasSupportPanels ? "" : "focus-workbench"}`}>
        {hasSupportPanels && (
          <section className="room-visual" aria-label="Kamerinformatie">
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
        )}

        {isAdviceRoom ? (
          <section className="advice-panel" aria-label="Advies aan de ouders">
            <span className="panel-label">Advies</span>
            <h3>Schrijf jullie eindadvies</h3>
            <p>
              Benoem duidelijk of jullie lineair of annuïtair adviseren. Gebruik minimaal drie voordelen of
              aandachtspunten, bijvoorbeeld totale kosten, maandlast, zekerheid, aflossing of betaalbaarheid.
            </p>
            <label>
              Advies aan de ouders
              <textarea
                value={advice}
                onChange={(event) => setAdvice(event.target.value)}
                placeholder="Schrijf hier jullie advies. Vraag daarna de docent om controle."
                disabled={roomSolved}
              />
            </label>
          </section>
        ) : (
          <section className="question-panel" aria-label="Vragen">
            <div className="question-panel-header">
              <span className="panel-label">Vragen</span>
              <strong>{room.puzzles.length} opdrachten</strong>
            </div>
            <div className="terminal-stack">
              {room.puzzles.map((puzzle) => (
                <EvidencePuzzle
                  key={puzzle.id}
                  puzzle={puzzle}
                  draftAnswer={draftAnswers[puzzle.id]}
                  status={answers[puzzle.id]}
                  feedback={feedback[puzzle.id]}
                  fiftyFiftyHiddenOptions={fiftyFiftyOptionsByPuzzle[puzzle.id] || []}
                  fiftyFiftyUsedPuzzleIds={fiftyFiftyUsedPuzzleIds}
                  fiftyFiftyBlockedSeconds={fiftyFiftyBlockedSeconds}
                  onDraftAnswer={onDraftAnswer}
                  onUseFiftyFifty={onUseFiftyFifty}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="room-footer">
        <section className={`room-codepad ${roomSolved ? "solved" : ""}`}>
          <div>
            <span className="panel-label">{isAdviceRoom ? "Docentcontrole" : hasEscapeCode ? "Codewoord" : "Onderzoek"}</span>
            <h3>{roomSolved ? "Onderzoek afgerond" : isAdviceRoom ? "Voer de docentcode in" : hasEscapeCode ? "Los het anagram op" : "Controleer antwoorden"}</h3>
            <p>{isAdviceRoom
              ? "Laat jullie advies controleren door de docent. Bij goedkeuring krijgen jullie de code."
              : hasEscapeCode
                ? "Sla alle zes vragen op, vorm met de gekozen letters het codewoord en rond daarna het onderzoek af."
                : "Sla per vraag je antwoord op en rond daarna het onderzoek af."}</p>
          </div>
          <form className={`room-code-form ${isAdviceRoom || hasEscapeCode ? "with-code" : "single-action"}`} onSubmit={(event) => {
            event.preventDefault();
            onSubmitRoomCheck(room.id, roomCode, advice);
          }}>
            {(isAdviceRoom || hasEscapeCode) && (
              <label>
                {isAdviceRoom ? "Docentcode" : "Codewoord"}
                <input
                  value={roomCode}
                  onChange={(event) => setRoomCode(event.target.value)}
                  placeholder={isAdviceRoom ? "code" : "Vul het codewoord in"}
                  disabled={roomSolved}
                />
              </label>
            )}
            <button className="primary-button compact" type="submit" disabled={roomSolved}>
              {isAdviceRoom ? "Win" : "Rond af"}
            </button>
          </form>
          {roomFeedback && (
            <p className={`room-alert ${roomSolved ? "correct" : "incorrect"}`} role="status">
              {roomFeedback}
            </p>
          )}
        </section>
      </footer>
    </section>
  );
}

export default RoomScreen;
