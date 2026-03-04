import { useState } from "react";

function useText(
  canvasRef,
  tool,
  strokes,
  redrawAll,
  offset,
  scale,
  saveHistory
){

  const [editing,setEditing] = useState(null);

  // WORLD COORDS
  const getMouse=(e)=>{
    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x:(e.clientX-rect.left-offset.current.x)/scale.current,
      y:(e.clientY-rect.top-offset.current.y)/scale.current
    };
  };

  //  CLICK → NEW TEXT
  const handleCanvasClick=(e)=>{
    if(tool!=="text") return;

    const {x,y}=getMouse(e);

    setEditing({
      x,
      y,
      text:"",
      size:20,
      color:"#111"
    });
  };

  //  SAVE TEXT
  const saveText=()=>{
    if(!editing) return;

    const ctx = canvasRef.current.getContext("2d");

    ctx.font = `${editing.size}px Arial`;

    const metrics = ctx.measureText(editing.text);

    const width = metrics.width;
    const height = editing.size * 1.2;

    if(editing.existing){
Object.assign(editing.existing,{
  text:editing.text,
  x:editing.x,
  y:editing.y,
  size:editing.size,
  width,
  height,
  style: editing.existing.style || "normal"
});


    }
    else if(editing.text.trim()!==""){
 strokes.current.push({
  type:"text",
  text:editing.text,
  x:editing.x,
  y:editing.y,
  size:editing.size,
  color:"#111",
  width,
  height,
  style:"normal"   // ADD THIS
});

    }

    saveHistory();
    setEditing(null);
    redrawAll();
  };

  return {
    editing,
    setEditing,
    handleCanvasClick,
    saveText
  };
}

export default useText;
