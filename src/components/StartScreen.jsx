function StartScreen({ onStart, onReset, hasProgress }) {
  return (
    <main className="start-screen">
      <section className="start-panel">
        <p className="eyebrow">Digitale escape room</p>
        <h1>De Hypotheekkluis</h1>
        <p className="story">
          In de kelder van de bank is een hypotheekdossier vergrendeld. Alleen
          teams die rente, aflossing, inkomen en woningwaarde kunnen doorrekenen
          krijgen de eindcode vrij.
        </p>

        <div className="mission-stats" aria-label="Missiegegevens">
          <span>6 kamers</span>
          <span>12 vragen</span>
          <span>15 minuten</span>
          <span>Client-side</span>
        </div>

        <div className="actions">
          <button className="primary-button" type="button" onClick={onStart}>
            {hasProgress ? "Ga verder" : "Start de missie"}
          </button>
          {hasProgress && (
            <button className="ghost-button" type="button" onClick={onReset}>
              Reset voortgang
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export default StartScreen;
