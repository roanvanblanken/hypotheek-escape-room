import { useEffect, useMemo, useState } from "react";
import "./App.css";
import FinalVault from "./components/FinalVault";
import GameLayout from "./components/GameLayout";
import RoomScreen from "./components/RoomScreen";
import StartScreen from "./components/StartScreen";
import StoryIntro from "./components/StoryIntro";
import { rooms } from "./data/rooms";
import { checkAnswer } from "./utils/answerCheckers";
import { clearProgress, loadProgress, saveProgress } from "./utils/storage";

const GAME_SECONDS = 15 * 60;

function createInitialProgress() {
  return {
    started: false,
    currentRoomIndex: 0,
    showOverview: false,
    answers: {},
    feedback: {},
    visibleHints: [],
    unlockedEvidence: [],
    completedRooms: [],
    unlockedRooms: [rooms[0].id],
    mistakes: 0,
    hintsUsed: 0,
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
    unlockedEvidence: saved.unlockedEvidence || [],
    unlockedRooms: saved.unlockedRooms || initial.unlockedRooms,
    showOverview: saved.showOverview || false,
  };
}

function App() {
  const [progress, setProgress] = useState(() => normalizeProgress(loadProgress()));
  const [introActive, setIntroActive] = useState(false);

  const currentRoom = rooms[progress.currentRoomIndex] || rooms[0];
  const allRoomsSolved = progress.completedRooms.length === rooms.length;
  const inFinalVault = allRoomsSolved || progress.finalVaultOpen;

  const codeFragments = useMemo(
    () => rooms.filter((room) => progress.completedRooms.includes(room.id)).map((room) => room.codeFragment),
    [progress.completedRooms],
  );

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

  function submitAnswer(puzzleId, rawAnswer) {
    const roomForPuzzle = rooms.find((room) => room.puzzles.some((item) => item.id === puzzleId));
    const puzzle = roomForPuzzle?.puzzles.find((item) => item.id === puzzleId);

    if (!puzzle || progress.answers[puzzleId] === "correct") {
      return;
    }

    const result = checkAnswer(puzzle, rawAnswer);

    setProgress((current) => {
      const evidenceId = puzzle.unlocksEvidenceId;
      const alreadyUnlocked = current.unlockedEvidence.includes(evidenceId);

      return {
        ...current,
        answers: {
          ...current.answers,
          [puzzleId]: result.correct ? "correct" : "incorrect",
        },
        feedback: {
          ...current.feedback,
          [puzzleId]: result.message,
        },
        unlockedEvidence: result.correct && !alreadyUnlocked
          ? [...current.unlockedEvidence, evidenceId]
          : current.unlockedEvidence,
        mistakes: result.correct ? current.mistakes : current.mistakes + 1,
      };
    });
  }

  function submitRoomCode(roomId, rawCode) {
    const room = rooms.find((item) => item.id === roomId);
    const normalized = String(rawCode || "").trim().toUpperCase().replace(/\s+/g, "");

    if (!room) {
      return { correct: false, message: "Onbekende kamer." };
    }

    if (normalized !== room.roomCode) {
      setProgress((current) => ({ ...current, mistakes: current.mistakes + 1 }));
      return { correct: false, message: "Het slot klikt rood. Combineer de vrijgespeelde bewijsstukken." };
    }

    setProgress((current) => {
      const completedRooms = current.completedRooms.includes(room.id)
        ? current.completedRooms
        : [...current.completedRooms, room.id];
      const nextRoom = rooms[rooms.findIndex((item) => item.id === room.id) + 1];
      const unlockedRooms = nextRoom && !current.unlockedRooms.includes(nextRoom.id)
        ? [...current.unlockedRooms, nextRoom.id]
        : current.unlockedRooms;

      return {
        ...current,
        completedRooms,
        unlockedRooms,
        showOverview: true,
      };
    });

    return {
      correct: true,
      message: `Het kamerslot opent. Fragment ${room.codeFragment} is toegevoegd aan het evidence board.`,
    };
  }

  function unlockFinalVault() {
    setProgress((current) => ({ ...current, finalVaultOpen: true }));
  }

  if (introActive) {
    return <StoryIntro onComplete={startGame} onBack={() => setIntroActive(false)} />;
  }

  if (!progress.started) {
    return (
      <StartScreen
        onStart={startStory}
        onReset={resetGame}
        hasProgress={Boolean(loadProgress()?.started)}
      />
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
    unlockedEvidence: progress.unlockedEvidence,
    onSelectRoom: selectRoom,
    onShowOverview: showOverview,
    onReset: resetGame,
    muted: progress.muted,
    onToggleMute: toggleMute,
  };

  if (progress.secondsRemaining <= 0 && !progress.finalVaultOpen) {
    return (
      <GameLayout {...layoutProps}>
        <section className="timeout-panel">
          <p className="eyebrow">Tijd verstreken</p>
          <h2>De kluis is opnieuw vergrendeld</h2>
          <p>Reset de missie om nog een poging te wagen.</p>
          <button className="primary-button" type="button" onClick={resetGame}>
            Opnieuw starten
          </button>
        </section>
      </GameLayout>
    );
  }

  return (
    <GameLayout {...layoutProps}>
      {progress.showOverview && !inFinalVault ? (
        <section className="overview-room">
          <p className="eyebrow">Overzicht</p>
          <h2>Kies een digitale kamer</h2>
          <p>
            Wissel vrij tussen geopende kamers. Eerdere kamers blijven beschikbaar om bewijsstukken opnieuw te bekijken.
          </p>
          <div className="overview-grid">
            {rooms.map((room, index) => {
              const unlocked = progress.unlockedRooms.includes(room.id);
              const solved = progress.completedRooms.includes(room.id);

              return (
                <button
                  className={`room-polaroid ${solved ? "solved" : ""}`}
                  key={room.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => selectRoom(index)}
                >
                  <span>{room.shortTitle}</span>
                  <strong>{room.title}</strong>
                  <small>{unlocked ? room.location : "vergrendeld"}</small>
                </button>
              );
            })}
          </div>
        </section>
      ) : inFinalVault ? (
        <FinalVault
          codeFragments={codeFragments}
          secondsRemaining={progress.secondsRemaining}
          mistakes={progress.mistakes}
          hintsUsed={progress.hintsUsed}
          completed={progress.finalVaultOpen}
          onUnlock={unlockFinalVault}
          onReset={resetGame}
        />
      ) : (
        <RoomScreen
          room={currentRoom}
          roomNumber={progress.currentRoomIndex + 1}
          totalRooms={rooms.length}
          answers={progress.answers}
          feedback={progress.feedback}
          visibleHints={progress.visibleHints}
          unlockedEvidence={progress.unlockedEvidence}
          roomSolved={progress.completedRooms.includes(currentRoom.id)}
          onSubmitAnswer={submitAnswer}
          onShowHint={showHint}
          onSubmitRoomCode={submitRoomCode}
        />
      )}
    </GameLayout>
  );
}

export default App;
