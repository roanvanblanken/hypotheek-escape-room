import { useEffect, useState } from "react";
import "./App.css";
import GameLayout from "./components/GameLayout";
import RoomScreen from "./components/RoomScreen";
import StartScreen from "./components/StartScreen";
import StoryIntro from "./components/StoryIntro";
import { CASE_DATA, rooms } from "./data/rooms";
import { checkAnswer } from "./utils/answerCheckers";
import { clearProgress, loadProgress, saveProgress } from "./utils/storage";

const GAME_SECONDS = 15 * 60;
const CASE_LABELS = {
  housePrice: "Kosten woning",
  savings: "Spaargeld",
  mortgage: "Hypotheek",
  yearlyRate: "Jaarlijkse rente",
  term: "Looptijd",
};

function createInitialProgress() {
  return {
    started: false,
    currentRoomIndex: 0,
    showOverview: false,
    draftAnswers: {},
    answers: {},
    feedback: {},
    roomFeedback: {},
    visibleHints: [],
    completedRooms: [],
    unlockedRooms: [rooms[0].id],
    mistakes: 0,
    hintsUsed: 0,
    fiftyFiftyPuzzleId: null,
    secondsRemaining: GAME_SECONDS,
    finalVaultOpen: false,
    muted: false,
  };
}

function normalizeProgress(saved) {
  if (!saved) {
    return createInitialProgress();
  }

  const initial = createInitialProgress();
  return {
    ...initial,
    ...saved,
    unlockedRooms: saved.unlockedRooms?.filter((id) => rooms.some((room) => room.id === id)) || initial.unlockedRooms,
    showOverview: saved.showOverview || false,
    draftAnswers: saved.draftAnswers || {},
    roomFeedback: saved.roomFeedback || {},
    fiftyFiftyPuzzleId: saved.fiftyFiftyPuzzleId || null,
  };
}

function App() {
  const [progress, setProgress] = useState(() => normalizeProgress(loadProgress()));
  const [introActive, setIntroActive] = useState(false);

  const currentRoom = rooms[progress.currentRoomIndex] || rooms[0];
  const gameWon = progress.finalVaultOpen;
  const gameLost = progress.started && progress.secondsRemaining <= 0 && !gameWon;

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (!progress.started || progress.finalVaultOpen || progress.secondsRemaining <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setProgress((current) => ({
        ...current,
        secondsRemaining: Math.max(0, current.secondsRemaining - 1),
      }));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [progress.started, progress.finalVaultOpen, progress.secondsRemaining]);

  function resetGame() {
    clearProgress();
    setIntroActive(false);
    setProgress(createInitialProgress());
  }

  function startStory() {
    if (progress.started) {
      return;
    }

    setIntroActive(true);
  }

  function startGame() {
    setIntroActive(false);
    setProgress((current) => ({ ...current, started: true, showOverview: true }));
  }

  function toggleMute() {
    setProgress((current) => ({ ...current, muted: !current.muted }));
  }

  function selectRoom(index) {
    const room = rooms[index];
    if (!room || !progress.unlockedRooms.includes(room.id)) {
      return;
    }

    setProgress((current) => ({
      ...current,
      currentRoomIndex: index,
      showOverview: false,
    }));
  }

  function showOverview() {
    setProgress((current) => ({ ...current, showOverview: true }));
  }

  function showHint(puzzleId) {
    setProgress((current) => {
      if (current.visibleHints.includes(puzzleId)) {
        return current;
      }

      return {
        ...current,
        visibleHints: [...current.visibleHints, puzzleId],
        hintsUsed: current.hintsUsed + 1,
      };
    });
  }

  function useFiftyFifty(puzzleId) {
    setProgress((current) => {
      if (current.fiftyFiftyPuzzleId) {
        return current;
      }

      return {
        ...current,
        fiftyFiftyPuzzleId: puzzleId,
        hintsUsed: current.hintsUsed + 1,
      };
    });
  }

  function saveDraftAnswer(puzzleId, rawAnswer) {
    setProgress((current) => {
      return {
        ...current,
        draftAnswers: {
          ...current.draftAnswers,
          [puzzleId]: rawAnswer,
        },
      };
    });
  }

  function submitRoomCheck(roomId, rawCode, adviceText = "") {
    const room = rooms.find((item) => item.id === roomId);

    if (!room || progress.completedRooms.includes(room.id) || progress.finalVaultOpen) {
      return;
    }

    setProgress((current) => {
      if (room.type === "advice") {
        const normalizedCode = String(rawCode || "").trim().toUpperCase().replace(/\s+/g, "");
        const advice = String(adviceText || "").trim();

        if (advice.length < 80) {
          return {
            ...current,
            mistakes: current.mistakes + 1,
            roomFeedback: {
              ...current.roomFeedback,
              [room.id]: "Schrijf eerst een duidelijk advies voor de ouders voordat je de docentcode invoert.",
            },
          };
        }

        if (normalizedCode !== room.teacherCode) {
          return {
            ...current,
            mistakes: current.mistakes + 1,
            roomFeedback: {
              ...current.roomFeedback,
              [room.id]: "De docentcode klopt nog niet. Vraag de docent om goedkeuring van jullie advies.",
            },
          };
        }

        return {
          ...current,
          completedRooms: current.completedRooms.includes(room.id)
            ? current.completedRooms
            : [...current.completedRooms, room.id],
          finalVaultOpen: true,
          roomFeedback: {
            ...current.roomFeedback,
            [room.id]: "Code geaccepteerd. Jullie advies is goedgekeurd.",
          },
        };
      }

      const results = room.puzzles.map((puzzle) => ({
        puzzle,
        result: checkAnswer(puzzle, current.draftAnswers[puzzle.id]),
      }));
      const roomSolved = results.every((item) => item.result.correct);

      if (!roomSolved) {
        return {
          ...current,
          mistakes: current.mistakes + 1,
          roomFeedback: {
            ...current.roomFeedback,
            [room.id]: "Nog niet alle antwoorden kloppen. Open de vragen, verbeter je antwoorden en probeer opnieuw.",
          },
        };
      }

      if (room.escapeCode) {
        const normalizedCode = String(rawCode || "").trim().toUpperCase().replace(/\s+/g, "");

        if (normalizedCode !== room.escapeCode) {
          return {
            ...current,
            mistakes: current.mistakes + 1,
            roomFeedback: {
              ...current.roomFeedback,
              [room.id]: "De antwoorden lijken goed, maar het codewoord klopt nog niet. Vorm het anagram met de zes letters.",
            },
          };
        }
      }

      const nextAnswers = { ...current.answers };
      const nextFeedback = { ...current.feedback };

      room.puzzles.forEach((puzzle) => {
        nextAnswers[puzzle.id] = "correct";
        const result = results.find((item) => item.puzzle.id === puzzle.id)?.result;
        nextFeedback[puzzle.id] = result?.message || "Antwoord goedgekeurd.";
      });

      const completedRooms = current.completedRooms.includes(room.id)
        ? current.completedRooms
        : [...current.completedRooms, room.id];
      const roomIndex = rooms.findIndex((item) => item.id === room.id);
      const nextRoom = rooms[roomIndex + 1];
      let unlockedRooms = current.unlockedRooms;
      let unlockMessage = nextRoom ? `${nextRoom.shortTitle} is ontgrendeld.` : "Onderzoek afgerond.";

      if (room.id === rooms[0].id) {
        const parallelRooms = rooms.slice(1, 4);
        unlockedRooms = Array.from(new Set([...current.unlockedRooms, ...parallelRooms.map((item) => item.id)]));
        unlockMessage = "Kamer 2, 3 en 4 zijn ontgrendeld.";
      } else if (rooms.slice(1, 4).some((item) => item.id === room.id)) {
        const calculationRoomsDone = rooms.slice(1, 4).every((item) => completedRooms.includes(item.id));

        if (calculationRoomsDone) {
          unlockedRooms = Array.from(new Set([...current.unlockedRooms, rooms[4].id]));
          unlockMessage = "Het advies is ontgrendeld.";
        } else {
          unlockMessage = "Onderzoek afgerond. Werk ook de andere berekeningen af om het advies te openen.";
        }
      } else if (nextRoom && !current.unlockedRooms.includes(nextRoom.id)) {
        unlockedRooms = [...current.unlockedRooms, nextRoom.id];
      }

      return {
        ...current,
        answers: nextAnswers,
        feedback: nextFeedback,
        completedRooms,
        unlockedRooms,
        showOverview: true,
        roomFeedback: {
          ...current.roomFeedback,
          [room.id]: unlockMessage,
        },
      };
    });
  }

  if (introActive) {
    return <StoryIntro onComplete={startGame} onBack={() => setIntroActive(false)} />;
  }

  if (!progress.started) {
    return (
      <StartScreen
        onStart={startStory}
      />
    );
  }

  if (gameWon) {
    return (
      <main className="end-screen win-screen">
        <section className="end-panel">
          <p className="eyebrow">Missie geslaagd</p>
          <h1>Gewonnen</h1>
          <p>
            De docent heeft jullie advies goedgekeurd. De ouders kunnen met een duidelijk en onderbouwd
            hypotheekadvies verder.
          </p>
          <button className="primary-button" type="button" onClick={resetGame}>
            Speel opnieuw
          </button>
        </section>
      </main>
    );
  }

  if (gameLost) {
    return (
      <main className="end-screen lose-screen">
        <section className="end-panel">
          <p className="eyebrow">Tijd voorbij</p>
          <h1>Verloren</h1>
          <p>
            De ouders hebben het advies niet op tijd gekregen. Start opnieuw, verdeel het werk slimmer en probeer
            sneller tot een goedgekeurd advies te komen.
          </p>
          <button className="primary-button" type="button" onClick={resetGame}>
            Probeer opnieuw
          </button>
        </section>
      </main>
    );
  }

  const layoutProps = {
    currentRoomIndex: progress.currentRoomIndex,
    rooms,
    secondsRemaining: progress.secondsRemaining,
    mistakes: progress.mistakes,
    hintsUsed: progress.hintsUsed,
    completedRooms: progress.completedRooms,
    unlockedRooms: progress.unlockedRooms,
    visibleHints: progress.visibleHints,
    onSelectRoom: selectRoom,
    onShowOverview: showOverview,
    onShowHint: showHint,
    onReset: resetGame,
    muted: progress.muted,
    onToggleMute: toggleMute,
  };

  return (
    <GameLayout {...layoutProps}>
      {progress.showOverview ? (
        <section className="overview-room">
          <div className="case-strip" aria-label="Centrale casus">
            {Object.entries(CASE_DATA).map(([key, value]) => (
              <span key={key}>
                <small>{CASE_LABELS[key]}</small>
                {value}
              </span>
            ))}
          </div>
          <div className="overview-heading">
            <p className="eyebrow">Overzicht</p>
            <h2>Adviesdossier van de ouders</h2>
            <p>
              Werk onderzoek voor onderzoek door. Elke afgeronde kamer ontgrendelt de volgende stap richting het
              eindadvies.
            </p>
          </div>
          <div className="overview-grid">
            {rooms.map((room, index) => {
              const unlocked = progress.unlockedRooms.includes(room.id);
              const solved = progress.completedRooms.includes(room.id);

              return (
                <button
                  className={`room-polaroid ${solved ? "solved" : ""} ${unlocked ? "available" : "locked"} ${index === progress.currentRoomIndex ? "current" : ""}`}
                  key={room.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => selectRoom(index)}
                >
                  <span>{room.shortTitle}</span>
                  <strong>{room.title}</strong>
                  <small>{unlocked ? (solved ? "Afgerond" : room.location) : "Vergrendeld"}</small>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <RoomScreen
          room={currentRoom}
          roomNumber={progress.currentRoomIndex + 1}
          totalRooms={rooms.length}
          draftAnswers={progress.draftAnswers}
          answers={progress.answers}
          feedback={progress.feedback}
          roomFeedback={progress.roomFeedback[currentRoom.id]}
          visibleHints={progress.visibleHints}
          roomSolved={progress.completedRooms.includes(currentRoom.id)}
          canUseFiftyFifty={progress.secondsRemaining <= GAME_SECONDS - 180}
          fiftyFiftyPuzzleId={progress.fiftyFiftyPuzzleId}
          onDraftAnswer={saveDraftAnswer}
          onSubmitRoomCheck={submitRoomCheck}
          onShowHint={showHint}
          onUseFiftyFifty={useFiftyFifty}
        />
      )}
    </GameLayout>
  );
}

export default App;
