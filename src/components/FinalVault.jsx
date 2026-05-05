import { useState } from "react";
import { FINAL_CODE } from "../data/rooms";
import { calculateScore } from "../utils/scoring";

function FinalVault({
  codeFragments,
  secondsRemaining,
  mistakes,
  hintsUsed,
  completed,
  onUnlock,
  onReset,
}) {
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("");
  const finalScore = calculateScore({ secondsRemaining, mistakes, hintsUsed, completed });

  function handleSubmit(event) {
    event.preventDefault();
    const normalized = entry.trim().toUpperCase().replace(/\s+/g, "");

    if (normalized === FINAL_CODE) {
      setMessage("De kluisdeur opent. Het hypotheekdossier is veiliggesteld.");
      onUnlock();
      return;
    }

    setMessage("De kluis weigert de code. Controleer de fragmenten in kamervolgorde.");
  }

  return (
    <section className="final-vault">
      <div className="vault-door" aria-hidden="true">
        <span />
      </div>
      <div className="final-content">
        <p className="eyebrow">Eindkluis</p>
        <h2>Voer de volledige code in</h2>
        <p>
          De terminal toont de verzamelde fragmenten:{" "}
          <strong className="fragment-strip">{codeFragments.join(" ")}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Eindcode
            <input
              value={entry}
              onChange={(event) => setEntry(event.target.value)}
              placeholder="Bijvoorbeeld EIGENWONING"
              disabled={completed}
            />
          </label>
          <button className="primary-button" type="submit" disabled={completed}>
            Open de kluis
          </button>
        </form>

        {message && <p className={`feedback ${completed ? "correct" : "incorrect"}`}>{message}</p>}

        {completed && (
          <div className="result-panel">
            <span className="panel-label">Eindscore</span>
            <strong>{finalScore}</strong>
            <button className="ghost-button" type="button" onClick={onReset}>
              Speel opnieuw
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default FinalVault;
