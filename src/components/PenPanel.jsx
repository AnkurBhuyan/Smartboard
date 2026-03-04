import { useState } from "react";
import { PaintBrushIcon, ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";
import "./PenPanel.css";

function PenPanel({ setColor, setSize, color, closePanel }) {

  const [closing,setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);

    setTimeout(()=>{
      closePanel(); // tells Board to hide
    },300);
  };

  return (
    <div className={`pen-panel ${closing ? "closing" : ""}`}>

      {/* << COLLAPSE BUTTON */}
      <button className="collapse-btn" onClick={handleClose}>
       <ChevronDoubleLeftIcon className="collapse-icon"/>

      </button>

      <h4>Pen</h4>

      {/* COLORS */}
      <div className="row">
        <button onClick={()=>setColor("#111")} className="dot black"/>
        <button onClick={()=>setColor("#2563eb")} className="dot blue"/>
        <button onClick={()=>setColor("#ef4444")} className="dot red"/>
      </div>

      <h4>Brush Size</h4>

      <div className="row">

        <button className="size-btn" onClick={()=>setSize(3)}>
          <PaintBrushIcon className="brush-icon small"/>
          <div className="stroke" style={{height:3, background:color}}/>
        </button>

        <button className="size-btn" onClick={()=>setSize(6)}>
          <PaintBrushIcon className="brush-icon medium"/>
          <div className="stroke" style={{height:6, background:color}}/>
        </button>

        <button className="size-btn" onClick={()=>setSize(12)}>
          <PaintBrushIcon className="brush-icon big"/>
          <div className="stroke" style={{height:12, background:color}}/>
        </button>

      </div>

    </div>
  );
}

export default PenPanel;
