import { useMemo, useState } from "react";
import {
  createSelectionDraft,
  getCollectedLetters,
  getCorrectAnswerIds,
  getSelectedAnswerIds,
  isQuestionFilled,
} from "../utils/answerCheckers";

const QUESTION_TYPE_LABELS = {
  multipleChoice: "Meerkeuze",
  multipleSelect: "Meerkeuze plus",
  numeric: "Berekening",
  matching: "Koppelen",
};

function formatCountdown(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function getInitialTextAnswer(draftAnswer) {
  if (draftAnswer && typeof draftAnswer === "object" && !Array.isArray(draftAnswer)) {
    return getSelectedAnswerIds(draftAnswer)[0] || "";
  }

  return typeof draftAnswer === "string" || typeof draftAnswer === "number" ? String(draftAnswer) : "";
}

function getInitialSelectedAnswers(draftAnswer) {
  if (Array.isArray(draftAnswer)) {
    return draftAnswer;
  }

  return getSelectedAnswerIds(draftAnswer);
}

function QuestionCard({ puzzle, filled, solved, onOpen }) {
  return (
    <article className={`evidence-puzzle puzzle-card ${filled ? "filled" : ""} ${solved ? "solved" : ""}`}>
      <button className="puzzle-card-trigger" type="button" onClick={onOpen}>
        <span className="terminal-line">{QUESTION_TYPE_LABELS[puzzle.type] || puzzle.type}</span>
        <strong>{puzzle.title}</strong>
        {filled && <span className="dossier-stamp">Ingevuld</span>}
      </button>
    </article>
  );
}

function FiftyFiftyButton({
  disabled,
  blockedSeconds,
  usedHere,
  usedElsewhere,
  canUse,
  onClick,
}) {
  const blocked = blockedSeconds > 0;
  let label = "50/50";

  if (usedHere) {
    label = "50/50 gebruikt";
  } else if (usedElsewhere && blocked) {
    label = `50/50 geblokkeerd: ${formatCountdown(blockedSeconds)}`;
  } else if (blocked || !canUse) {
    label = `50/50 geblokkeerd: ${formatCountdown(blockedSeconds)}`;
  }

  return (
    <button
      className={`fifty-fifty-button ${disabled ? "blocked" : ""}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

function QuestionModal({
  puzzle,
  answer,
  selectedAnswers,
  matchingAnswers,
  hiddenOptions,
  solved,
  saveWarning,
  feedback,
  fiftyFifty,
  onAnswerChange,
  onSelectedToggle,
  onMatchingChange,
  onSave,
  onClose,
}) {
  const supportsFiftyFifty = puzzle.type === "multipleChoice" || puzzle.type === "multipleSelect";
  const visibleOptions = puzzle.options
    ? Object.entries(puzzle.options).filter(([key]) => !hiddenOptions.includes(key))
    : [];
  const collectedLetters = useMemo(
    () => getCollectedLetters(puzzle, puzzle.type === "multipleSelect" ? selectedAnswers : answer),
    [answer, puzzle, selectedAnswers],
  );

  return (
    <div className="puzzle-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="puzzle-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${puzzle.id}-title`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span className="panel-label">{QUESTION_TYPE_LABELS[puzzle.type] || puzzle.type}</span>
            <h2 id={`${puzzle.id}-title`}>{puzzle.title}</h2>
          </div>
          <button className="icon-button compact" type="button" onClick={onClose}>
            Sluit
          </button>
        </header>

        <div className="puzzle-modal-body">
          {puzzle.narrative && <p className="narrative">{puzzle.narrative}</p>}
          {puzzle.code && <pre className="code-snippet">{puzzle.code}</pre>}
          <p className="task-line">{puzzle.task}</p>

          <form onSubmit={onSave}>
            {puzzle.type === "numeric" && (
              <label>
                Berekening
                <input
                  inputMode="decimal"
                  value={answer}
                  onChange={(event) => onAnswerChange(event.target.value)}
                  placeholder="typ je analyse"
                  disabled={solved}
                />
              </label>
            )}

            {puzzle.type === "multipleChoice" && (
              <fieldset disabled={solved}>
                <legend>Selecteer een antwoord</legend>
                {visibleOptions.map(([key, value]) => (
                  <label className="choice" key={key}>
                    <input
                      type="radio"
                      name={puzzle.id}
                      value={key}
                      checked={answer === key}
                      onChange={(event) => onAnswerChange(event.target.value)}
                    />
                    <span className="choice-key">{key}</span>
                    <span className="choice-text">{value}</span>
                    {puzzle.optionLetters?.[key] && (
                      <span className="choice-letter">Letter {puzzle.optionLetters[key]}</span>
                    )}
                  </label>
                ))}
              </fieldset>
            )}

            {puzzle.type === "multipleSelect" && (
              <fieldset disabled={solved}>
                <legend>Selecteer precies alle juiste antwoorden</legend>
                {visibleOptions.map(([key, value]) => (
                  <label className="choice" key={key}>
                    <input
                      type="checkbox"
                      value={key}
                      checked={selectedAnswers.includes(key)}
                      onChange={() => onSelectedToggle(key)}
                    />
                    <span className="choice-key">{key}</span>
                    <span className="choice-text">{value}</span>
                    {puzzle.optionLetters?.[key] && (
                      <span className="choice-letter">Letter {puzzle.optionLetters[key]}</span>
                    )}
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
                      onChange={(event) => onMatchingChange(item.term, event.target.value)}
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

            {collectedLetters.length > 0 && (
              <div className="collected-letter-strip" aria-label="Gekozen dossierletters">
                <span>Gekozen letters</span>
                <strong>{collectedLetters.join(" ")}</strong>
              </div>
            )}

            {saveWarning && (
              <p className="inline-alert" role="status">
                {saveWarning}
              </p>
            )}

            <div className="puzzle-actions">
              {supportsFiftyFifty && (
                <FiftyFiftyButton
                  disabled={fiftyFifty.disabled}
                  blockedSeconds={fiftyFifty.blockedSeconds}
                  usedHere={fiftyFifty.usedHere}
                  usedElsewhere={fiftyFifty.usedElsewhere}
                  canUse={fiftyFifty.canUse}
                  onClick={fiftyFifty.onUse}
                />
              )}
              <button className="primary-button compact" type="submit" disabled={solved}>
                {solved ? "Opgeslagen" : "Antwoord opslaan"}
              </button>
            </div>
          </form>

          {feedback && solved && (
            <p className="feedback correct" role="status">
              {feedback}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function EvidencePuzzle({
  puzzle,
  draftAnswer,
  status,
  feedback,
  fiftyFiftyHiddenOptions = [],
  fiftyFiftyUsedPuzzleIds = [],
  fiftyFiftyBlockedSeconds = 0,
  onDraftAnswer,
  onUseFiftyFifty,
}) {
  const [answer, setAnswer] = useState(() => getInitialTextAnswer(draftAnswer));
  const [selectedAnswers, setSelectedAnswers] = useState(() => getInitialSelectedAnswers(draftAnswer));
  const [matchingAnswers, setMatchingAnswers] = useState(() =>
    draftAnswer && typeof draftAnswer === "object" && !Array.isArray(draftAnswer) && !draftAnswer.selectedAnswerIds
      ? draftAnswer
      : {},
  );
  const [open, setOpen] = useState(false);
  const [saveWarning, setSaveWarning] = useState("");

  const solved = status === "correct";
  const filled = isQuestionFilled(puzzle, draftAnswer);
  const supportsFiftyFifty = puzzle.type === "multipleChoice" || puzzle.type === "multipleSelect";
  const hiddenOptions = fiftyFiftyHiddenOptions;
  const visibleAnswer = hiddenOptions.includes(answer) ? "" : answer;
  const visibleSelectedAnswers = selectedAnswers.filter((item) => !hiddenOptions.includes(item));
  const usedHere = fiftyFiftyUsedPuzzleIds.includes(puzzle.id);
  const usedElsewhere = fiftyFiftyUsedPuzzleIds.some((id) => id !== puzzle.id);
  const canUseFiftyFifty = supportsFiftyFifty && fiftyFiftyBlockedSeconds <= 0 && !usedHere && !solved;

  function getFiftyFiftyOptionsToHide() {
    const correctAnswers = getCorrectAnswerIds(puzzle);
    const wrongOptions = Object.keys(puzzle.options || {}).filter((key) => !correctAnswers.includes(key.toUpperCase()));

    return wrongOptions.slice(0, puzzle.type === "multipleSelect" ? 2 : 2);
  }

  function currentAnswer() {
    if (puzzle.type === "multipleChoice") {
      return createSelectionDraft(puzzle, visibleAnswer ? [visibleAnswer] : []);
    }

    if (puzzle.type === "multipleSelect") {
      return createSelectionDraft(puzzle, visibleSelectedAnswers);
    }

    if (puzzle.type === "matching") {
      return matchingAnswers;
    }

    return answer;
  }

  function handleSave(event) {
    event.preventDefault();

    if ((puzzle.type === "multipleChoice" || puzzle.type === "multipleSelect") && !isQuestionFilled(puzzle, currentAnswer())) {
      setSaveWarning("Kies eerst minimaal een antwoord voordat je de vraag opslaat.");
      return;
    }

    setSaveWarning("");
    onDraftAnswer(puzzle.id, currentAnswer());
    setOpen(false);
  }

  function toggleSelected(value) {
    setSaveWarning("");
    setSelectedAnswers((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  }

  function handleMatchingChange(term, value) {
    setMatchingAnswers((current) => ({ ...current, [term]: value }));
  }

  function useFiftyFifty() {
    if (!canUseFiftyFifty) {
      return;
    }

    const optionsToHide = getFiftyFiftyOptionsToHide();
    onUseFiftyFifty?.(puzzle.id, optionsToHide);
  }

  return (
    <>
      <QuestionCard puzzle={puzzle} filled={filled} solved={solved} onOpen={() => setOpen(true)} />

      {open && (
        <QuestionModal
          puzzle={puzzle}
          answer={visibleAnswer}
          selectedAnswers={visibleSelectedAnswers}
          matchingAnswers={matchingAnswers}
          hiddenOptions={hiddenOptions}
          solved={solved}
          saveWarning={saveWarning}
          feedback={feedback}
          onAnswerChange={(value) => {
            setSaveWarning("");
            setAnswer(value);
          }}
          onSelectedToggle={toggleSelected}
          onMatchingChange={handleMatchingChange}
          onSave={handleSave}
          onClose={() => setOpen(false)}
          fiftyFifty={{
            disabled: !canUseFiftyFifty,
            blockedSeconds: fiftyFiftyBlockedSeconds,
            usedHere,
            usedElsewhere,
            canUse: canUseFiftyFifty,
            onUse: useFiftyFifty,
          }}
        />
      )}
    </>
  );
}

export default EvidencePuzzle;
