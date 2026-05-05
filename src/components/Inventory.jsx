import { useState } from "react";
import EvidenceModal from "./EvidenceModal";

function Inventory({ rooms, unlockedEvidence }) {
  const [activeItem, setActiveItem] = useState(null);
  const items = rooms.flatMap((room) =>
    room.evidenceItems
      .filter((item) => unlockedEvidence.includes(item.id))
      .map((item) => ({ ...item, label: item.inventoryLabel, roomTitle: room.shortTitle })),
  );

  return (
    <section className="inventory">
      <span className="panel-label">Inventory</span>
      <div className="inventory-grid">
        {items.length === 0 ? (
          <p>Objecten zoals rentetabel, dossierkaart en aflossingsstrook komen hier.</p>
        ) : (
          items.map((item) => (
            <button className="inventory-item" key={item.id} type="button" onClick={() => setActiveItem(item)}>
              <span>{item.type}</span>
              <strong>{item.label}</strong>
            </button>
          ))
        )}
      </div>
      <EvidenceModal item={activeItem} onClose={() => setActiveItem(null)} />
    </section>
  );
}

export default Inventory;
