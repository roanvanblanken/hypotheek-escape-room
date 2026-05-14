function Inventory({ rooms, unlockedEvidence }) {
  const total = rooms.reduce((sum, room) => sum + room.evidenceItems.length, 0);

  return (
    <section className="inventory">
      <span className="panel-label">Bewijsmap</span>
      <strong>
        {unlockedEvidence.length}/{total}
      </strong>
      <p>Bewijsstukken komen vrij zodra een heel onderzoek klopt.</p>
    </section>
  );
}

export default Inventory;
