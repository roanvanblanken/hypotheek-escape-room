import { useState } from "react";

function RoomCodePad({ room, solved, evidenceCount, totalEvidence, onSubmitCode }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const result = onSubmitCode(room.id, code);
    setMessage(result.message);
    if (result.correct) {
      setCode("");
    }
  }

  return (
    <section className={`room-codepad ${solved ? "solved" : ""}`}>
      <div>
        <span className="panel-label">Kamerslot</span>
        <h3>{solved ? "Kamer opgelost" : "Leid de kamercode af"}</h3>
        <p>
          Bewijsstukken: {evidenceCount}/{totalEvidence}. De code verschijnt pas na correcte invoer.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Kamercode
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="bijv. A3"
            disabled={solved}
          />
        </label>
        <button className="primary-button compact" type="submit" disabled={solved}>
          Test slot
        </button>
      </form>
      {message && <p className={`feedback ${solved ? "correct" : "incorrect"}`}>{message}</p>}
    </section>
  );
}

export default RoomCodePad;
