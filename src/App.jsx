import { useEffect, useMemo, useState } from "react";
import "./App.css";
import FinalVault from "./components/FinalVault";
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
    draftAnswers: saved.draftAnswers || {},
    roomFeedback: saved.roomFeedback || {},
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

  function submitRoomCheck(roomId, rawCode) {
    const room = rooms.find((item) => item.id === roomId);

    if (!room || progress.completedRooms.includes(room.id)) {
      return;
    }

    setProgress((current) => {
      const normalizedCode = String(rawCode || "").trim().toUpperCase().replace(/\s+/g, "");
      const results = room.puzzles.map((puzzle) => ({
        puzzle,
        result: checkAnswer(puzzle, current.draftAnswers[puzzle.id]),
      }));
      const roomSolved = results.every((item) => item.result.correct) && normalizedCode === room.roomCode;

      if (!roomSolved) {
        return {
          ...current,
          mistakes: current.mistakes + 1,
          roomFeedback: {
            ...current.roomFeedback,
            [room.id]: "Het codeslot blijft dicht. Er zit nog ergens een fout in de dossierkaarten of in het codewoord.",
          },
        };
      }

      const nextAnswers = { ...current.answers };
      const nextFeedback = { ...current.feedback };
      const nextEvidence = [...current.unlockedEvidence];

      room.puzzles.forEach((puzzle) => {
        nextAnswers[puzzle.id] = "correct";
        nextFeedback[puzzle.id] = "Bewijsstuk vrijgegeven.";
        if (!nextEvidence.includes(puzzle.unlocksEvidenceId)) {
          nextEvidence.push(puzzle.unlocksEvidenceId);
        }
      });

      const completedRooms = current.completedRooms.includes(room.id)
        ? current.completedRooms
        : [...current.completedRooms, room.id];
      const unlockedRooms = room.id === "kenniscontrole" ? rooms.map((item) => item.id) : current.unlockedRooms;

      return {
        ...current,
        answers: nextAnswers,
        feedback: nextFeedback,
        unlockedEvidence: nextEvidence,
        completedRooms,
        unlockedRooms,
        showOverview: true,
        roomFeedback: {
          ...current.roomFeedback,
          [room.id]: "Code geaccepteerd. De bewijsstukken zijn aan het adviesdossier toegevoegd.",
        },
      };
    });
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
      {progress.showOverview && !inFinalVault ? (
        <section className="overview-room">
          <p className="eyebrow">Overzicht</p>
          <h2>Adviesdossier van de ouders</h2>
          <p>
            Rond de startcontrole af om de onderzoeksbladen tegelijk te openen. Daarna kunnen teams strategisch
            verdelen wie welke controle uitvoert.
          </p>
          <div className="case-strip" aria-label="Centrale casus">
            {Object.entries(CASE_DATA).map(([key, value]) => (
              <span key={key}>
                <small>{CASE_LABELS[key]}</small>
                {value}
              </span>
            ))}
          </div>
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
                  <small>{unlocked ? room.location : "na startcontrole"}</small>
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
          draftAnswers={progress.draftAnswers}
          answers={progress.answers}
          feedback={progress.feedback}
          roomFeedback={progress.roomFeedback[currentRoom.id]}
          visibleHints={progress.visibleHints}
          unlockedEvidence={progress.unlockedEvidence}
          roomSolved={progress.completedRooms.includes(currentRoom.id)}
          onDraftAnswer={saveDraftAnswer}
          onSubmitRoomCheck={submitRoomCheck}
          onShowHint={showHint}
        />
      )}
    </GameLayout>
  );
}

export default App;
