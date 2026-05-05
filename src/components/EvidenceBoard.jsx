import { useState } from "react";
import EvidenceModal from "./EvidenceModal";

function EvidenceBoard({ rooms, unlockedEvidence, completedRooms }) {
  const [activeEvidence, setActiveEvidence] = useState(null);
  const evidence = rooms.flatMap((room) =>
    room.evidenceItems
      .filter((item) => unlockedEvidence.includes(item.id))
      .map((item) => ({ ...item, roomTitle: room.shortTitle })),
  );

  const fragments = rooms
    .filter((room) => completedRooms.includes(room.id))
    .map((room) => ({ id: room.id, label: room.codeFragment, room: room.shortTitle }));

  return (
    <section className="evidence-board">
      <span className="panel-label">Evidence board</span>
      <div className="fragment-wall">
        {fragments.length === 0 ? (
          <p>Nog geen codefragmenten. Los een kamercode op.</p>
        ) : (
          fragments.map((fragment) => (
            <div className="fragment-note" key={fragment.id}>
              <small>{fragment.room}</small>
              <strong>{fragment.label}</strong>
            </div>
          ))
        )}
      </div>
      <div className="evidence-stack">
        {evidence.length === 0 ? (
          <p>Vrijgespeelde aanwijzingen verschijnen hier als notities.</p>
        ) : (
          evidence.map((item) => (
            <button className="sticky-evidence" key={item.id} type="button" onClick={() => setActiveEvidence(item)}>
              <small>{item.roomTitle} - {item.type}</small>
              <strong>{item.title}</strong>
              <p>{item.clue}</p>
            </button>
          ))
        )}
      </div>
      <EvidenceModal item={activeEvidence} onClose={() => setActiveEvidence(null)} />
    </section>
  );
}

export default EvidenceBoard;
