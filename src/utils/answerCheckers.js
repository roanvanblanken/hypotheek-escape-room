export function normalizeChoice(value) {
  return String(value || "").trim().toUpperCase();
}

export function checkAnswer(question, rawAnswer) {
  if (question.type === "numeric") {
    const parsed = Number(String(rawAnswer).replace(",", "."));

    if (!Number.isFinite(parsed)) {
      return {
        correct: false,
        message: "De terminal accepteert alleen cijfers voor deze analyse.",
      };
    }

    const tolerance = question.tolerance ?? 0;
    const correct = Math.abs(parsed - question.answer) <= tolerance;

    return {
      correct,
      message: correct
        ? question.successReveal
        : question.wrongFeedback || `De berekening valt buiten de marge van ${tolerance}.`,
    };
  }

  if (question.type === "multipleChoice") {
    const selected = normalizeChoice(rawAnswer);
    const correct = selected === normalizeChoice(question.answer);

    return {
      correct,
      message: correct
        ? question.successReveal
        : question.wrongFeedback || "Die keuze ontgrendelt niets. Bekijk het bewijsstuk nog eens.",
    };
  }

  if (question.type === "sequence") {
    const expected = Array.isArray(question.answer) ? question.answer.join(",") : String(question.answer);
    const normalized = String(rawAnswer || "").replace(/\s+/g, "").toUpperCase();
    const correct = normalized === expected.replace(/\s+/g, "").toUpperCase();

    return {
      correct,
      message: correct ? question.successReveal : question.wrongFeedback || "De volgorde klopt nog niet.",
    };
  }

  if (question.type === "matching") {
    const normalized = String(rawAnswer || "").trim().toUpperCase();
    const expected = String(question.answer || "").trim().toUpperCase();
    const correct = normalized === expected;

    return {
      correct,
      message: correct ? question.successReveal : question.wrongFeedback || "De koppeling klopt nog niet.",
    };
  }

  return {
    correct: false,
    message: "Onbekend vraagtype.",
  };
}
