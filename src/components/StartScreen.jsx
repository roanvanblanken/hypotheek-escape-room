const mortgageNotes = [
  "L = P x r / (1 - (1 + r)^-n)",
  "€350.000 - €75.000 = €275.000",
  "r = 4,2% / 12",
  "n = 30 x 12 = 360",
  "Aflossing + rente = maandlast",
  "LTV = hypotheek / woningwaarde",
  "€275.000 x 0,00342",
  "annuiteit = constant",
  "lineair: schuld daalt elke maand",
  "toetsrente + inkomen + risico",
  "buffer = spaargeld - kosten koper",
  "restschuld na t maanden",
];

function StartScreen({ onStart }) {
  return (
    <main className="start-screen">
      <div className="mortgage-math-layer" aria-hidden="true">
        {mortgageNotes.map((note, index) => (
          <span className={`mortgage-note mortgage-note-${index + 1}`} key={note}>
            {note}
          </span>
        ))}
      </div>
      <section className="start-panel" aria-label="Start Hypotheekcheck">
        <div className="start-title-block">
          <p className="eyebrow">Escape room</p>
          <h1>Hypotheekcheck</h1>
          <p>Een vakoverstijgende escape room voor Bedrijfseconomie, Wiskunde en Informatica</p>
        </div>
        <button className="primary-button start-button" type="button" onClick={onStart}>
          <span aria-hidden="true">🔒</span>
          Start de escape room
        </button>
      </section>
    </main>
  );
}

export default StartScreen;
