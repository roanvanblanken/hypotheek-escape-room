import { calculateScore } from "../utils/scoring";

function ScorePanel({ secondsRemaining, mistakes, hintsUsed, completed = false }) {
  const score = calculateScore({ secondsRemaining, mistakes, hintsUsed, completed });

  return (
    <section className="score-panel">
      <span className="panel-label">Score</span>
      <strong>{score}</strong>
      <dl>
        <div>
          <dt>Fouten</dt>
          <dd>{mistakes}</dd>
        </div>
        <div>
          <dt>Hints</dt>
          <dd>{hintsUsed}</dd>
        </div>
      </dl>
    </section>
  );
}

export default ScorePanel;
