import { useMemo, useState } from "react";
import { calculateScore } from "../utils/scoring";

const memoChecks = [
  {
    id: "mortgage",
    label: "Welk hypotheekbedrag hebben de ouders nodig?",
    answer: 400000,
    tolerance: 1,
    suffix: "EUR",
  },
  {
    id: "linearFirst",
    label: "Wat is het eerste maandbedrag bij de lineaire hypotheek?",
    answer: 1493.97,
    tolerance: 1,
    suffix: "EUR",
  },
  {
    id: "annuityMonthly",
    label: "Wat is het vaste maandbedrag bij de annuitaire hypotheek?",
    answer: 1207.5,
    tolerance: 1,
    suffix: "EUR",
  },
  {
    id: "linearTotal",
    label: "Hoeveel betalen ze ongeveer totaal bij de lineaire hypotheek?",
    answer: 558882,
    tolerance: 500,
    suffix: "EUR",
  },
  {
    id: "annuityTotal",
    label: "Hoeveel betalen ze ongeveer totaal bij de annuitaire hypotheek?",
    answer: 579598,
    tolerance: 500,
    suffix: "EUR",
  },
  {
    id: "difference",
    label: "Hoeveel verschil zit daartussen?",
    answer: 20716,
    tolerance: 600,
    suffix: "EUR",
  },
];

function parseNumber(value) {
  const raw = String(value || "")
    .replace(/\s/g, "")
    .replace(/[^\d.,-]/g, "");

  if (!raw) {
    return [];
  }

  return [
    Number(raw.replace(/\./g, "").replace(",", ".")),
    Number(raw.replace(/,/g, "")),
  ].filter((item) => Number.isFinite(item));
}

function FinalVault({
  codeFragments,
  secondsRemaining,
  mistakes,
  hintsUsed,
  completed,
  onUnlock,
  onReset,
}) {
  const [values, setValues] = useState({});
  const [cheapest, setCheapest] = useState("");
  const [advice, setAdvice] = useState("");
  const [message, setMessage] = useState("");
  const finalScore = calculateScore({ secondsRemaining, mistakes, hintsUsed, completed });

  const summary = useMemo(
    () => codeFragments.filter(Boolean).join(" | "),
    [codeFragments],
  );

  function updateValue(id, value) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const numericCorrect = memoChecks.every((check) => {
      const parsedValues = parseNumber(values[check.id]);
      return parsedValues.some((parsed) => Math.abs(parsed - check.answer) <= check.tolerance);
    });
    const cheapestCorrect = cheapest === "lineair";
    const advicePoints = ["lineair", "annuitair", "goedkoper", "maandlast", "rente", "aflossing"].filter((word) =>
      advice.toLowerCase().includes(word),
    ).length;

    if (numericCorrect && cheapestCorrect && advice.trim().length > 120 && advicePoints >= 3) {
      setMessage(
        "Adviesmemo afgerond. Jullie advies erkent de lagere totale kosten van lineair en geeft ruimte voor de betaalbaarheid van annuitair.",
      );
      onUnlock();
      return;
    }

    setMessage(
      "Het memo is nog niet compleet. Controleer de bedragen, kies de goedkoopste optie en onderbouw het advies met minimaal drie duidelijke voordelen of nadelen.",
    );
  }

  return (
    <section className="final-vault advice-memo">
      <div className="memo-preview" aria-hidden="true">
        <span>Adviesmemo</span>
        <strong>Ouders van jullie vriend</strong>
        <p>Hypotheek: EUR 400.000</p>
        <p>Looptijd: 40 jaar</p>
        <p>Rente: door jullie gecontroleerd</p>
      </div>
      <div className="final-content">
        <p className="eyebrow">Eindopdracht</p>
        <h2>Schrijf het adviesmemo</h2>
        <p>
          Alle onderzoeken zijn afgerond. Gebruik de bewijsstukken om de belangrijkste conclusies samen te brengen.
          Onderzoeken: <strong className="fragment-strip">{summary}</strong>
        </p>

        <form className="memo-form" onSubmit={handleSubmit}>
          <div className="memo-grid">
            {memoChecks.map((check) => (
              <label key={check.id}>
                {check.label}
                <input
                  value={values[check.id] || ""}
                  onChange={(event) => updateValue(check.id, event.target.value)}
                  placeholder={check.suffix === "EUR" ? "EUR ..." : "..."}
                  disabled={completed}
                  inputMode="decimal"
                />
              </label>
            ))}
          </div>

          <fieldset disabled={completed}>
            <legend>Welke hypotheek is in totaal goedkoper?</legend>
            <label className="choice">
              <input
                type="radio"
                name="cheapest"
                value="lineair"
                checked={cheapest === "lineair"}
                onChange={(event) => setCheapest(event.target.value)}
              />
              <span>A</span>
              De lineaire hypotheek
            </label>
            <label className="choice">
              <input
                type="radio"
                name="cheapest"
                value="annuitair"
                checked={cheapest === "annuitair"}
                onChange={(event) => setCheapest(event.target.value)}
              />
              <span>B</span>
              De annuitaire hypotheek
            </label>
          </fieldset>

          <label>
            Advies aan de ouders
            <textarea
              value={advice}
              onChange={(event) => setAdvice(event.target.value)}
              placeholder="Geef een advies. Benoem minimaal drie voordelen of nadelen en leg uit waarom jullie keuze past bij de ouders."
              disabled={completed}
            />
          </label>

          <button className="primary-button" type="submit" disabled={completed}>
            Dien adviesmemo in
          </button>
        </form>

        {message && <p className={`feedback ${completed ? "correct" : "incorrect"}`}>{message}</p>}

        {completed && (
          <div className="result-panel">
            <span className="panel-label">Eindstatus</span>
            <strong>{finalScore}</strong>
            <button className="ghost-button" type="button" onClick={onReset}>
              Nieuwe poging
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default FinalVault;
