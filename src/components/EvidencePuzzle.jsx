import { useState } from "react";
import HintPanel from "./HintPanel";

function EvidencePuzzle({
  puzzle,
  status,
  feedback,
  hintVisible,
  evidence,
  evidenceUnlocked,
  onSubmit,
  onShowHint,
}) {
  const [answer, setAnswer] = useState("");
  const solved = status === "correct";

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(puzzle.id, answer);
  }

  return (
    <article className={`evidence-puzzle ${solved ? "solved" : ""}`}>
      <header className="terminal-header">
        <span>{puzzle.type}</span>
        <strong>{solved ? "bewijs vrij" : "analyse nodig"}</strong>
      </header>

      <div className="terminal-body">
        <p className="terminal-title">{puzzle.title}</p>
        <p className="narrative">{puzzle.narrative}</p>
        <p className="task-line">{puzzle.task}</p>

        <form onSubmit={handleSubmit}>
          {puzzle.type === "numeric" && (
            <label>
              Berekening
              <input
                inputMode="decimal"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="typ je analyse"
                disabled={solved}
              />
            </label>
          )}

          {puzzle.type === "multipleChoice" && (
            <fieldset disabled={solved}>
              <legend>Selecteer dossierregel</legend>
              {Object.entries(puzzle.options).map(([key, value]) => (
                <label className="choice" key={key}>
                  <input
                    type="radio"
                    name={puzzle.id}
                    value={key}
                    checked={answer === key}
                    onChange={(event) => setAnswer(event.target.value)}
                  />
                  <span>{key}</span>
                  {value}
                </label>
              ))}
            </fieldset>
          )}

          {(puzzle.type === "sequence" || puzzle.type === "matching") && (
            <label>
              Experimentele invoer
              <input
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="basisstructuur voor later"
                disabled={solved}
              />
            </label>
          )}

          <div className="puzzle-actions">
            <button className="primary-button compact" type="submit" disabled={solved}>
              {solved ? "Bewijsstuk vrij" : "Ontgrendel bewijsstuk"}
            </button>
            <button
              className="ghost-button compact"
              type="button"
              onClick={() => onShowHint(puzzle.id)}
              disabled={hintVisible}
            >
              Dossierhint
            </button>
          </div>
        </form>

        <HintPanel hint={puzzle.hint} visible={hintVisible} onShowHint={() => onShowHint(puzzle.id)} />

        {feedback && (
          <p className={`feedback ${solved ? "correct" : "incorrect"}`} role="status">
            {feedback}
          </p>
        )}

        <div className={`evidence-slot ${evidenceUnlocked ? "unlocked" : ""}`}>
          <span className="panel-label">Gekoppeld bewijs</span>
          <strong>{evidenceUnlocked ? evidence.title : "vergrendeld object"}</strong>
          <p>{evidenceUnlocked ? evidence.clue : "Los deze handeling op om een aanwijzing of object vrij te spelen."}</p>
        </div>
      </div>
    </article>
  );
}

export default EvidencePuzzle;
