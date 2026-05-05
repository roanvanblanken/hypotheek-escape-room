const TIME_WEIGHT = 8;
const MISTAKE_PENALTY = 35;
const HINT_PENALTY = 20;
const COMPLETION_BONUS = 250;

export function calculateScore({ secondsRemaining, mistakes, hintsUsed, completed }) {
  const timeScore = Math.max(0, secondsRemaining) * TIME_WEIGHT;
  const penalties = mistakes * MISTAKE_PENALTY + hintsUsed * HINT_PENALTY;
  const score = timeScore + (completed ? COMPLETION_BONUS : 0) - penalties;

  return Math.max(0, Math.round(score));
}
