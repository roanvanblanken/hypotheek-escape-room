export function normalizeChoice(value) {
  return String(value || "").trim().toUpperCase();
}

export function getCorrectAnswerIds(question) {
  const configured = question.correctAnswerIds || question.answer;
  return (Array.isArray(configured) ? configured : [configured]).filter(Boolean).map(normalizeChoice);
}

export function getAnswerLetterMap(question) {
  return question.answerLetters || {};
}

export function getSelectedAnswerIds(rawAnswer) {
  if (rawAnswer && typeof rawAnswer === "object" && !Array.isArray(rawAnswer)) {
    return Array.isArray(rawAnswer.selectedAnswerIds) ? rawAnswer.selectedAnswerIds.map(normalizeChoice) : [];
  }

  return (Array.isArray(rawAnswer) ? rawAnswer : [rawAnswer]).filter(Boolean).map(normalizeChoice);
}

export function getCollectedLetters(question, rawAnswer) {
  const visibleLetters = question.optionLetters || getAnswerLetterMap(question);
  return getSelectedAnswerIds(rawAnswer)
    .map((answerId) => visibleLetters[answerId])
    .filter(Boolean);
}

export function isQuestionFilled(question, rawAnswer) {
  if (rawAnswer && typeof rawAnswer === "object" && !Array.isArray(rawAnswer) && rawAnswer.filled === true) {
    return true;
  }

  if (question.type === "multipleChoice" || question.type === "multipleSelect") {
    return getSelectedAnswerIds(rawAnswer).length > 0;
  }

  if (question.type === "matching") {
    return Boolean(rawAnswer && typeof rawAnswer === "object" && Object.keys(rawAnswer).length > 0);
  }

  return rawAnswer !== undefined && String(rawAnswer || "").trim() !== "";
}

export function createSelectionDraft(question, selectedAnswerIds) {
  const normalizedSelected = selectedAnswerIds.filter(Boolean).map(normalizeChoice);

  return {
    selectedAnswerIds: normalizedSelected,
    filled: normalizedSelected.length > 0,
    correctAnswerIds: getCorrectAnswerIds(question),
    answerLetters: getAnswerLetterMap(question),
    collectedLetters: getCollectedLetters(question, normalizedSelected),
  };
}

function choicesMatchExactly(question, rawAnswer) {
  const selected = getSelectedAnswerIds(rawAnswer).sort();
  const expected = getCorrectAnswerIds(question).sort();

  return selected.length === expected.length && selected.every((value, index) => value === expected[index]);
}

function numericCandidates(rawAnswer) {
  const raw = String(rawAnswer || "")
    .trim()
    .replace(/\s/g, "")
    .replace(/[€A-Za-z]/g, "");

  if (!raw) {
    return [];
  }

  const candidates = [];
  const decimalComma = Number(raw.replace(/\./g, "").replace(",", "."));
  const decimalPoint = Number(raw.replace(/,/g, ""));
  const noThousands = Number(raw.replace(/\./g, "").replace(",", "."));

  [decimalComma, decimalPoint, noThousands].forEach((value) => {
    if (Number.isFinite(value) && !candidates.includes(value)) {
      candidates.push(value);
    }
  });

  return candidates;
}

function cleanFeedback(message) {
  return String(message || "")
    .replace(/^Correct\.?\s*/i, "")
    .replace(/^Nog niet\.?\s*/i, "")
    .trim();
}

export function checkAnswer(question, rawAnswer) {
  if (question.type === "numeric") {
    const candidates = numericCandidates(rawAnswer);

    if (candidates.length === 0) {
      return {
        correct: false,
        message: "De terminal accepteert alleen cijfers voor deze analyse.",
      };
    }

    const tolerance = question.tolerance ?? 0;
    const correct = candidates.some((parsed) => Math.abs(parsed - question.answer) <= tolerance);

    return {
      correct,
      message: correct
        ? cleanFeedback(question.successReveal || "Antwoord goedgekeurd.")
        : cleanFeedback(question.wrongFeedback || `Dit opent nog niets. Controleer je analyse en probeer opnieuw.`),
    };
  }

  if (question.type === "multipleChoice") {
    const correct = choicesMatchExactly(question, rawAnswer);

    return {
      correct,
      message: correct
        ? cleanFeedback(question.successReveal || "Antwoord goedgekeurd.")
        : cleanFeedback(question.wrongFeedback || "Deze keuze klopt nog niet. Controleer de vraag en probeer opnieuw."),
    };
  }

  if (question.type === "multipleSelect") {
    const correct = choicesMatchExactly(question, rawAnswer);

    return {
      correct,
      message: correct
        ? cleanFeedback(question.successReveal || "Antwoord goedgekeurd.")
        : cleanFeedback(question.wrongFeedback || "Deze combinatie klopt nog niet. Controleer de vraag en probeer opnieuw."),
    };
  }

  if (question.type === "sequence") {
    const expected = Array.isArray(question.answer) ? question.answer.join(",") : String(question.answer);
    const normalized = String(rawAnswer || "").replace(/\s+/g, "").toUpperCase();
    const correct = normalized === expected.replace(/\s+/g, "").toUpperCase();

    return {
      correct,
      message: correct
        ? cleanFeedback(question.successReveal || "Antwoord goedgekeurd.")
        : cleanFeedback(question.wrongFeedback || "De volgorde opent nog niets."),
    };
  }

  if (question.type === "matching") {
    const answers = rawAnswer && typeof rawAnswer === "object" ? rawAnswer : {};
    const correct = question.matches.every((item) => normalizeChoice(answers[item.term]) === normalizeChoice(item.answer));

    return {
      correct,
      message: correct
        ? cleanFeedback(question.successReveal || "Antwoord goedgekeurd.")
        : cleanFeedback(question.wrongFeedback || "Deze koppeling klopt nog niet. Controleer de vraag en probeer opnieuw."),
    };
  }

  return {
    correct: false,
    message: "Onbekend vraagtype.",
  };
}
