function HintPanel({ hint, visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="hint-panel">
      <p>{hint}</p>
    </div>
  );
}

export default HintPanel;
