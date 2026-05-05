function EvidenceModal({ item, onClose }) {
  if (!item) {
    return null;
  }

  return (
    <div className="evidence-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`evidence-modal ${item.type}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span className="panel-label">{item.type}</span>
            <h2 id="evidence-title">{item.title}</h2>
          </div>
          <button className="icon-button compact" type="button" onClick={onClose} aria-label="Bewijsstuk sluiten">
            Sluit
          </button>
        </header>

        <div className="evidence-document">
          <div className="document-stamp">{item.roomTitle || "Dossier"}</div>
          <p>{item.clue}</p>
          <div className="document-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    </div>
  );
}

export default EvidenceModal;
