function StartScreen({ onStart, onReset, hasProgress }) {
  return (
    <main className="start-screen">
      <section className="start-panel">
        <p className="eyebrow">Interactieve adviesmissie</p>
        <h1>De Hypotheekcheck</h1>
        <p className="story">
          De ouders van een goede vriend van jullie zijn van plan om een huis te kopen. Ze huren nu nog en hebben
          geen ervaring met kopen. Daarom hebben ze een hypotheekadviseur aangenomen om te helpen. Deze adviseur
          bleek helaas een oplichter en heeft documenten slecht ingevuld en slecht advies gegeven. Nu is er weinig
          tijd om dit recht te zetten. Omdat jullie de laatste tijd veel hebben geleerd over hypotheken, vraagt de
          klas om hulp. Wees zorgvuldig, maar ook snel: dan geven jullie het beste advies.
        </p>

        <div className="mission-stats" aria-label="Missiegegevens">
          <span>5 onderzoeken</span>
          <span>27 controles</span>
          <span>1 centrale casus</span>
          <span>adviesmemo</span>
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
