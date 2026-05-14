import { useState } from "react";

function EvidencePuzzle({
  puzzle,
  draftAnswer,
  status,
  feedback,
  canUseFiftyFifty,
  fiftyFiftyPuzzleId,
  onDraftAnswer,
  onUseFiftyFifty,
}) {
  const [answer, setAnswer] = useState(() => (typeof draftAnswer === "string" || typeof draftAnswer === "number" ? String(draftAnswer) : ""));
  const [selectedAnswers, setSelectedAnswers] = useState(() => (Array.isArray(draftAnswer) ? draftAnswer : []));
  const [matchingAnswers, setMatchingAnswers] = useState(() =>
    draftAnswer && typeof draftAnswer === "object" && !Array.isArray(draftAnswer) ? draftAnswer : {},
  );
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(draftAnswer !== undefined);
  const [hiddenOptions, setHiddenOptions] = useState(() =>
    fiftyFiftyPuzzleId === puzzle.id ? getFiftyFiftyOptionsToHide() : [],
  );
  const solved = status === "correct";
  const supportsFiftyFifty = puzzle.type === "multipleChoice" || puzzle.type === "multipleSelect";
  const fiftyFiftyUsedHere = hiddenOptions.length > 0 || fiftyFiftyPuzzleId === puzzle.id;
  const fiftyFiftyUsedElsewhere = Boolean(fiftyFiftyPuzzleId && fiftyFiftyPuzzleId !== puzzle.id);
  const visibleOptions = puzzle.options
    ? Object.entries(puzzle.options).filter(([key]) => !hiddenOptions.includes(key))
    : [];

  function getFiftyFiftyOptionsToHide() {
    const correctAnswers = (Array.isArray(puzzle.answer) ? puzzle.answer : [puzzle.answer]).map((item) =>
      String(item).toUpperCase(),
    );
    const wrongOptions = Object.keys(puzzle.options || {}).filter((key) => !correctAnswers.includes(key.toUpperCase()));

    return wrongOptions.slice(0, 2);
  }

  function hideFiftyFiftyOptions(optionsToHide) {
    setHiddenOptions(optionsToHide);
    setSelectedAnswers((current) => current.filter((item) => !optionsToHide.includes(item)));
    if (optionsToHide.includes(answer)) {
      setAnswer("");
    }
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

  function useFiftyFifty() {
    if (!supportsFiftyFifty || !canUseFiftyFifty || fiftyFiftyUsedHere || fiftyFiftyUsedElsewhere || solved) {
      return;
    }

    hideFiftyFiftyOptions(getFiftyFiftyOptionsToHide());
    onUseFiftyFifty?.(puzzle.id);
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
          <legend>Selecteer één antwoord</legend>
          {visibleOptions.map(([key, value]) => (
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

      {puzzle.type === "multipleSelect" && (
        <fieldset disabled={solved}>
          <legend>Selecteer alle juiste antwoorden</legend>
          {visibleOptions.map(([key, value]) => (
            <label className="choice" key={key}>
              <input
                type="checkbox"
                value={key}
                checked={selectedAnswers.includes(key)}
                onChange={() => toggleSelected(key)}
              />
              <span>{key}</span>
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
        {supportsFiftyFifty && (
          <button
            className="fifty-fifty-button"
            type="button"
            onClick={useFiftyFifty}
            disabled={solved || fiftyFiftyUsedHere || fiftyFiftyUsedElsewhere || !canUseFiftyFifty}
          >
            {fiftyFiftyUsedHere || fiftyFiftyUsedElsewhere ? "50/50 gebruikt" : canUseFiftyFifty ? "50/50" : "50/50 na 3 min"}
          </button>
        )}
        <button className="primary-button compact" type="submit" disabled={solved}>
          {solved ? "Goedgekeurd" : "Antwoord opslaan"}
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
          {puzzle.codeLetter && <span className="puzzle-card-letter">Letter {puzzle.codeLetter}</span>}
          <small>{solved ? "goedgekeurd" : saved ? "antwoord opgeslagen" : "klik om vraag te openen"}</small>
        </button>
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
                {puzzle.codeLetter && <p className="question-letter">Anagramletter: {puzzle.codeLetter}</p>}
              </div>
              <button className="icon-button compact" type="button" onClick={() => setOpen(false)}>
                Sluit
              </button>
            </header>

            <div className="puzzle-modal-body">
              {puzzle.narrative && <p className="narrative">{puzzle.narrative}</p>}
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
