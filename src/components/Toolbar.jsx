import { useState, useEffect } from "react";
import {
  FaPen,
  FaEraser,
  FaShapes,
  FaFont,
  FaMousePointer
} from "react-icons/fa";
import "./Toolbar.css";

function Toolbar({
  tool,
  selectPen,
  selectEraser,
  selectShape,
  selectText,
  selectSelect
}) {

  const [collapsed, setCollapsed] = useState(false);

  // Auto collapse on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  return (
    <>
      {/*OPEN HANDLE */}
      {collapsed && (
        <div
          className="toolbar-handle"
          onClick={() => setCollapsed(false)}
        >
          ☰
        </div>
      )}

      {/*  TOOLBAR*/}
      <div className={`toolbar ${collapsed ? "collapsed" : ""}`}>

        {/* Collapse Button */}
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(true)}
        >
          ✕
        </button>

        <button
          className={`icon-btn ${tool==="select"?"active":""}`}
          onClick={selectSelect}
        >
          <FaMousePointer/>
        </button>

        <button
          className={`icon-btn ${tool==="pen"?"active":""}`}
          onClick={selectPen}
        >
          <FaPen/>
        </button>

        <button
          className={`icon-btn ${tool==="eraser"?"active":""}`}
          onClick={selectEraser}
        >
          <FaEraser/>
        </button>

        <button
          className={`icon-btn ${tool==="shape"?"active":""}`}
          onClick={selectShape}
        >
          <FaShapes/>
        </button>

        <button
          className={`icon-btn ${tool==="text"?"active":""}`}
          onClick={selectText}
        >
          <FaFont/>
        </button>

      </div>
    </>
  );
}

export default Toolbar;
