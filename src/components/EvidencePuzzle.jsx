import { useState } from "react";

function EvidencePuzzle({
  puzzle,
  draftAnswer,
  status,
  feedback,
  evidence,
  evidenceUnlocked,
  onDraftAnswer,
}) {
  const [answer, setAnswer] = useState(() => (typeof draftAnswer === "string" || typeof draftAnswer === "number" ? String(draftAnswer) : ""));
  const [selectedAnswers, setSelectedAnswers] = useState(() => (Array.isArray(draftAnswer) ? draftAnswer : []));
  const [matchingAnswers, setMatchingAnswers] = useState(() =>
    draftAnswer && typeof draftAnswer === "object" && !Array.isArray(draftAnswer) ? draftAnswer : {},
  );
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(draftAnswer !== undefined);
  const solved = status === "correct";
  const labelOffset = puzzle.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const labelPool = ["K", "M", "R", "T", "V", "Z", "L", "P", "N", "S", "W", "G"];

  function displayLetter(optionKey, index) {
    return puzzle.optionLetters?.[optionKey] || labelPool[(labelOffset + index * 3) % labelPool.length];
  }

  function currentAnswer() {
    if (puzzle.type === "multipleSelect") {
      return selectedAnswers;
    }

    if (puzzle.type === "matching") {
      return matchingAnswers;
    }

    return answer;
  }

  function handleSave(event) {
    event.preventDefault();
    onDraftAnswer(puzzle.id, currentAnswer());
    setSaved(true);
    setOpen(false);
  }

  function toggleSelected(value) {
    setSelectedAnswers((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  const form = (
    <form onSubmit={handleSave}>
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
          {Object.entries(puzzle.options).map(([key, value], index) => (
            <label className="choice" key={key}>
              <input
                type="radio"
                name={puzzle.id}
                value={key}
                checked={answer === key}
                onChange={(event) => setAnswer(event.target.value)}
              />
              <span>{displayLetter(key, index)}</span>
              {value}
            </label>
          ))}
        </fieldset>
      )}

      {puzzle.type === "multipleSelect" && (
        <fieldset disabled={solved}>
          <legend>Selecteer alle passende dossierregels</legend>
          {Object.entries(puzzle.options).map(([key, value], index) => (
            <label className="choice" key={key}>
              <input
                type="checkbox"
                value={key}
                checked={selectedAnswers.includes(key)}
                onChange={() => toggleSelected(key)}
              />
              <span>{displayLetter(key, index)}</span>
              {value}
            </label>
          ))}
        </fieldset>
      )}

      {puzzle.type === "matching" && (
        <div className="matching-grid">
          <div className="meaning-list">
            {Object.entries(puzzle.meanings).map(([key, value]) => (
              <p key={key}>
                <strong>{key}</strong> {value}
              </p>
            ))}
          </div>
          {puzzle.matches.map((item) => (
            <label key={item.term}>
              {item.term}
              <select
                value={matchingAnswers[item.term] || ""}
                onChange={(event) =>
                  setMatchingAnswers((current) => ({ ...current, [item.term]: event.target.value }))
                }
                disabled={solved}
              >
                <option value="">Kies betekenis</option>
                {Object.keys(puzzle.meanings).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

      <div className="puzzle-actions">
        <button className="primary-button compact" type="submit" disabled={solved}>
          {solved ? "Bewijsstuk vrij" : "Leg vast in dossier"}
        </button>
      </div>
    </form>
  );

  return (
    <>
      <article className={`evidence-puzzle puzzle-card ${solved ? "solved" : ""}`}>
        <button className="puzzle-card-trigger" type="button" onClick={() => setOpen(true)}>
          <span className="terminal-line">{puzzle.type}</span>
          <strong>{puzzle.title}</strong>
          <small>{solved ? "bewijsstuk vrij" : saved ? "keuze vastgelegd" : "klik om dossierkaart te openen"}</small>
        </button>

        <div className={`evidence-slot ${evidenceUnlocked ? "unlocked" : ""}`}>
          <span className="panel-label">Gekoppeld bewijs</span>
          <strong>{evidenceUnlocked ? evidence.title : "nog niet vrijgegeven"}</strong>
          <p>{evidenceUnlocked ? evidence.clue : "Open de dossierkaart om dit bewijsstuk vrij te spelen."}</p>
        </div>
      </article>

      {open && (
        <div className="puzzle-modal-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="puzzle-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${puzzle.id}-title`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span className="panel-label">{puzzle.type}</span>
                <h2 id={`${puzzle.id}-title`}>{puzzle.title}</h2>
              </div>
              <button className="icon-button compact" type="button" onClick={() => setOpen(false)}>
                Sluit
              </button>
            </header>

            <div className="puzzle-modal-body">
              <p className="narrative">{puzzle.narrative}</p>
              {puzzle.code && <pre className="code-snippet">{puzzle.code}</pre>}
              <p className="task-line">{puzzle.task}</p>

              {form}

              {feedback && (
                <p className={`feedback ${solved ? "correct" : "incorrect"}`} role="status">
                  {feedback}
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default EvidencePuzzle;
