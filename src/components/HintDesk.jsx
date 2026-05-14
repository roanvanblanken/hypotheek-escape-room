import { useState } from "react";

const TOTAL_SECONDS = 15 * 60;
const DUMMY_HINTS = [
  "Dummy hint 1: kijk eerst welke gegevens in de casus vaststaan.",
  "Dummy hint 2: controleer of een bedrag een hoofdsom, rente of maandlast is.",
  "Dummy hint 3: let op het verschil tussen per jaar en per maand.",
  "Dummy hint 4: bij codevragen moet een variabele in de loop veranderen.",
  "Dummy hint 5: bij meerkeuze zijn absolute woorden zoals altijd verdacht.",
  "Dummy hint 6: zet jaren om naar maanden voordat je maandbedragen vergelijkt.",
  "Dummy hint 7: rente bereken je over de schuld die nog openstaat.",
  "Dummy hint 8: bij annuitair blijft het totale maandbedrag gelijk.",
  "Dummy hint 9: bij lineair blijft het aflossingsdeel gelijk.",
  "Dummy hint 10: verzamel eerst alle letters voordat je het codewoord probeert.",
];

function HintDesk({ visibleHints, onShowHint, secondsRemaining }) {
  const [open, setOpen] = useState(false);
  const elapsedSeconds = Math.max(0, TOTAL_SECONDS - secondsRemaining);
  const unlockedCount = Math.min(DUMMY_HINTS.length, Math.floor(elapsedSeconds / 30));

  function openHint(id, unlocked) {
    if (!unlocked) {
      return;
    }

    onShowHint(id);
  }

  return (
    <>
      <section className="hint-desk">
        <span className="panel-label">Hintbalie</span>
        <button className="primary-button compact hint-desk-button" type="button" onClick={() => setOpen(true)}>
          Druk hier voor hints
        </button>
        <p>{unlockedCount}/10 hints vrijgegeven</p>
      </section>

      {open && (
        <div className="hint-shop-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="hint-shop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hint-shop-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span className="panel-label">Hintbalie</span>
                <h2 id="hint-shop-title">Hintshop</h2>
              </div>
              <button className="icon-button compact" type="button" onClick={() => setOpen(false)}>
                Sluit
              </button>
            </header>

            <div className="hint-shop-grid">
              {DUMMY_HINTS.map((text, index) => {
                const id = `dummy-hint-${index + 1}`;
                const unlocked = index < unlockedCount;
                const opened = visibleHints.includes(id);

                return (
                  <button
                    className={`${unlocked ? "unlocked" : ""} ${opened ? "opened" : ""}`}
                    key={id}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => openHint(id, unlocked)}
                  >
                    <span>Hint {index + 1}</span>
                    <strong>{unlocked ? (opened ? text : "Beschikbaar") : `Vrij over ${30 * (index + 1)} sec`}</strong>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default HintDesk;
