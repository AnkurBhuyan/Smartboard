import { useState } from "react";
import { 
  ChevronDoubleLeftIcon,
  StopIcon
} from "@heroicons/react/24/solid";

import "./EraserPanel.css";

function EraserPanel({ setEraserSize, closePanel }) {

  // Default medium size
  const [activeSize, setActiveSize] = useState(30);

  // Select size
  const selectSize = (s) => {
    setActiveSize(s);
    setEraserSize(s);
  };

  return (
    <div className="eraser-panel">

      {/* collapse */}
      <button
        className="eraser-collapse-btn"
        onClick={closePanel}
      >
        <ChevronDoubleLeftIcon className="eraser-collapse-icon"/>
      </button>

      <h4>Eraser</h4>

      {/*  SIZE */}
      <h4>Size</h4>

      <div className="eraser-row">

        {/* SMALL */}
        <button
          className={`eraser-btn ${activeSize===15?"active":""}`}
          onClick={()=>selectSize(15)}
        >
          <StopIcon className="size-icon small"/>
        </button>

        {/* MEDIUM */}
        <button
          className={`eraser-btn ${activeSize===30?"active":""}`}
          onClick={()=>selectSize(30)}
        >
          <StopIcon className="size-icon medium"/>
        </button>

        {/* LARGE */}
        <button
          className={`eraser-btn ${activeSize===60?"active":""}`}
          onClick={()=>selectSize(60)}
        >
          <StopIcon className="size-icon large"/>
        </button>

        {/* EXTRA LARGE  */}
        <button
          className={`eraser-btn ${activeSize===100?"active":""}`}
          onClick={()=>selectSize(100)}
        >
          <StopIcon className="size-icon xlarge"/>
        </button>

      </div>

    </div>
  );
}

export default EraserPanel;
