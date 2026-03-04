import "./TopBar.css";

function TopBar({ onUndo, onRedo, onClear, onSave, onFullscreen }) {
  return (
    <div className="topbar">

      <h2 className="title">Smart Board</h2>

      <div className="actions">
        <button onClick={onUndo}>Undo</button>
        <button onClick={onRedo}>Redo</button>
        <button onClick={onSave}>Save</button>

        <button onClick={onClear} className="clear">
          Clear
        </button>

        <button onClick={onFullscreen}>
          ⛶
        </button>

      </div>

    </div>
  );
}

export default TopBar;
