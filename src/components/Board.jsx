import { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import useToolbar from "./useToolbar";
import PenPanel from "./PenPanel";
import EraserPanel from "./EraserPanel";
import Shape from "./Shape";
import useEraser from "./useEraser";
import "./Board.css";
import useText from "./useText";
import useSelect from "./useSelect";
import TopBar from "./TopBar";
import useHistory from "./useHistory";


function Board(){

  const canvasRef = useRef(null); //direct dom access to canvas element

  const { tool, selectPen, selectEraser, selectShape, selectSelect, selectText } = useToolbar(); // custom hook for managing toolbar state

  const [drawing,setDrawing] = useState(false); // to prevent drawing when not intended
  const [panelOpen,setPanelOpen] = useState(true);

  const [color,setColor] = useState("#111");
  const [size,setSize] = useState(6);
  const [eraserSize,setEraserSize] = useState(25);

  const [selectedShape,setSelectedShape] = useState("rectangle");
  const [shapeStart,setShapeStart] = useState(null); // shape drawing needs to remember where it started to show live preview
  const [shapeEnd,setShapeEnd] = useState(null);
  const [shapePanelOpen,setShapePanelOpen] = useState(false);

  const offset = useRef({ x: 0, y: 0 });
const panning = useRef(false);
const panStart = useRef({ x: 0, y: 0 });
const scale = useRef(1);

const [selectionVersion,setSelectionVersion] = useState(0);

  const strokes = useRef([]);
  const currentStroke = useRef([]);




// PAN & ZOOM 
  
const startPan = (e) => {
  if (!e.altKey && e.button !== 1) return;

  panning.current = true;
  panStart.current = { x: e.clientX, y: e.clientY };
};

const movePan = (e) => {
  if (!panning.current) return;

  const dx = (e.clientX - panStart.current.x) / scale.current;
  const dy = (e.clientY - panStart.current.y) / scale.current;

  offset.current.x += dx;
  offset.current.y += dy;

  panStart.current = { x: e.clientX, y: e.clientY };

  redrawAll();
};

const stopPan = () => {
  panning.current = false;
};


//  DRAW SHAPE 
  const drawShape=(ctx,s)=>{
    const {type,start,end,color,size}=s;

    ctx.strokeStyle=color;
    ctx.lineWidth=size;

    const w=end.x-start.x;
    const h=end.y-start.y;

    ctx.beginPath();

    if(type==="rectangle"){
      ctx.strokeRect(start.x,start.y,w,h);
    }

    else if(type==="circle"){
      ctx.ellipse(start.x+w/2,start.y+h/2,Math.abs(w/2),Math.abs(h/2),0,0,Math.PI*2);
      ctx.stroke();
    }

    else if(type==="line"){
      ctx.moveTo(start.x,start.y);
      ctx.lineTo(end.x,end.y);
      ctx.stroke();
    }

    //  ARROW
    else if(type==="arrow"){
      const head=16;
      const dx=end.x-start.x;
      const dy=end.y-start.y;
      const angle=Math.atan2(dy,dx);

      const lx=end.x-head*Math.cos(angle);
      const ly=end.y-head*Math.sin(angle);

      ctx.moveTo(start.x,start.y);
      ctx.lineTo(lx,ly);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(end.x,end.y);
      ctx.lineTo(end.x-head*Math.cos(angle-Math.PI/6),end.y-head*Math.sin(angle-Math.PI/6));
      ctx.lineTo(end.x-head*Math.cos(angle+Math.PI/6),end.y-head*Math.sin(angle+Math.PI/6));
      ctx.closePath();
      ctx.fillStyle=color;
      ctx.fill();
    }

    else if(type==="triangle"){
      ctx.moveTo(start.x+w/2,start.y);
      ctx.lineTo(start.x,start.y+h);
      ctx.lineTo(start.x+w,start.y+h);
      ctx.closePath();
      ctx.stroke();
    }
  };
const drawStroke = (ctx, s) => {
  ctx.strokeStyle = s.color;
  ctx.lineWidth = s.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  s.points.forEach((p,i)=>
    i ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y)
  );
  ctx.stroke();
};
const handleSave = () => {
  const canvas = canvasRef.current;

  // Show message
  alert("Your image is being downloaded...");

  // Convert to png and trigger download
  const link = document.createElement("a");
  link.download = "smart-board.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
const goFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
  // redraw all strokes from memory (used for panning, zooming, undo/redo, etc)
const redrawAll=()=>{
  const canvas=canvasRef.current;
   if(!canvas) return;
  const ctx=canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;

  //  reset transform first
  ctx.setTransform(1,0,0,1,0,0);

  //  clear using raw pixels
  ctx.clearRect(0,0,canvas.width,canvas.height);

 ctx.scale(dpr,dpr);

//  camera transform
ctx.translate(offset.current.x, offset.current.y);
ctx.scale(scale.current, scale.current);


strokes.current.forEach(s=>{

  // text 
  if(s.type==="text"){

    ctx.textBaseline="top";

    if(s.style==="heading"){
      ctx.font=`bold ${s.size}px Arial`;
      ctx.fillStyle="#111";
    }
    else if(s.style==="subheading"){
      ctx.font=`${s.size}px Arial`;
      ctx.fillStyle="#555";
    }
    else{
      ctx.font=`${s.size}px Arial`;
      ctx.fillStyle=s.color;
    }

    // align text to top-left corner
    ctx.fillText(s.text, s.x, s.y);
  }

  // shapes
  else if(s.type){
    drawShape(ctx,s);
  }

  //  pen
  else if(s.points){
    drawStroke(ctx,s);
  }

});

  //  live stroke (while drawing)
if(currentStroke.current.length){
  drawStroke(ctx,{
    points: currentStroke.current,
    color,
    size
  });
}


// selected outline
const sel = selectLogic.selected?.current;
if(sel && sel.type==="text"){

  ctx.strokeStyle="blue";
  ctx.lineWidth=1;
  ctx.setLineDash([6]);

  ctx.strokeRect(
    sel.x,
    sel.y,
    sel.width,
    sel.height
  );

  ctx.setLineDash([]);
// STYLE BADGE INSIDE BOX 
if(sel.style==="heading" || sel.style==="subheading"){

  const label =
    sel.style==="heading"
      ? "H1"
      : "H2";

  // badge background
  ctx.fillStyle="#2563eb";
  ctx.fillRect(
    sel.x+4,
    sel.y+4,
    26,
    16
  );

  // badge text
  ctx.fillStyle="white";
  ctx.font="bold 11px Arial";
  ctx.textBaseline="top";

  ctx.fillText(
    label,
    sel.x+9,
    sel.y+6
  );
}



  // resize handle
const hx = sel.x + sel.width;
const hy = sel.y + sel.height;

ctx.strokeStyle="#2563eb";
ctx.lineWidth=2;
ctx.lineCap="round";

// CENTER OFFSET 
const size = 10; // small icon
const cx = hx - size/2;
const cy = hy - size/2;


// MAIN DIAGONAL LINE 
ctx.beginPath();
ctx.moveTo(cx-size/2, cy-size/2);
ctx.lineTo(cx+size/2, cy+size/2);
ctx.stroke();


//  ARROW HEAD 
ctx.beginPath();
ctx.moveTo(cx+size/2-4, cy+size/2);
ctx.lineTo(cx+size/2, cy+size/2);
ctx.lineTo(cx+size/2, cy+size/2-4);
ctx.stroke();


//  ARROW HEAD 2 
ctx.beginPath();
ctx.moveTo(cx-size/2+4, cy-size/2);
ctx.lineTo(cx-size/2, cy-size/2);
ctx.lineTo(cx-size/2, cy-size/2+4);
ctx.stroke();


}


};
const {
  saveHistory,
  undo,
  redo,
  clearBoard
} = useHistory(strokes, redrawAll);



  //  HOOKS  
 const {editing,setEditing,handleCanvasClick,saveText}
  = useText(canvasRef,tool,strokes,redrawAll,offset,scale,saveHistory );


  const selectLogic=useSelect(
  strokes,
  redrawAll,
  ()=>setSelectionVersion(v=>v+1)
);

  const {eraseAt}=useEraser({strokes,eraserSize,redrawAll});

  //  DPI 
  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");

    

    const resize=()=>{
      const dpr=window.devicePixelRatio||1;
      const rect=canvas.getBoundingClientRect();

      canvas.width=rect.width*dpr;
      canvas.height=rect.height*dpr;

      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(dpr,dpr);

      redrawAll();
    };

    resize();
    window.addEventListener("resize",resize);
    return ()=>window.removeEventListener("resize",resize);
  },[]);
useEffect(()=>{
  const canvas = canvasRef.current;

  const handleWheel = (e)=>{
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();

    // mouse position in world space
    const mx = (e.clientX - rect.left - offset.current.x) / scale.current;
    const my = (e.clientY - rect.top - offset.current.y) / scale.current;

    const zoom = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.3, scale.current + zoom), 4);

    // adjust offset so zoom centers on mouse
    offset.current.x -= mx * (newScale - scale.current);
    offset.current.y -= my * (newScale - scale.current);

    scale.current = newScale;

    redrawAll();
  };

  canvas.addEventListener("wheel", handleWheel, { passive:false });

  return ()=>canvas.removeEventListener("wheel", handleWheel);
},[]);


const getPos = (e) => {
  const rect = canvasRef.current.getBoundingClientRect();

  return {
    x: (e.clientX - rect.left) / scale.current - offset.current.x,
    y: (e.clientY - rect.top) / scale.current - offset.current.y
  };
};

  // START DRAW 
  const startDraw=e=>{
    if(tool==="text"||tool==="select") return;

    const pos=getPos(e);

    if(tool==="shape"){
      setShapeStart(pos);
      setDrawing(true);
      return;
    }

    currentStroke.current=[pos];
    setDrawing(true);
  };

  //  DRAW 
  const draw=e=>{
    if(!drawing) return;

    const ctx=canvasRef.current.getContext("2d");
    const pos=getPos(e);

    if(tool==="eraser") return eraseAt(pos);

    if(tool==="shape" && shapeStart){
      setShapeEnd(pos);
      redrawAll();
       
     ctx.save();

const dpr = window.devicePixelRatio || 1;

ctx.setTransform(dpr,0,0,dpr,0,0);
ctx.translate(offset.current.x, offset.current.y);
ctx.scale(scale.current, scale.current);

drawShape(ctx,{
  type:selectedShape,
  start:shapeStart,
  end:pos,
  color,
  size
});

ctx.restore();

      return;
    }

 if(tool==="pen"){
  currentStroke.current.push(pos);
  redrawAll(); // live preview
}

    
  };

  // STOP DRAW 
  const stopDraw=()=>{
 if(tool==="shape" && shapeStart && shapeEnd){
  strokes.current.push({
    type:selectedShape,
    start:shapeStart,
    end:shapeEnd,
    color,
    size
  });

  saveHistory();
}


    if(tool==="pen" && currentStroke.current.length){
      strokes.current.push({
        points:[...currentStroke.current],
        color,size
      });
      saveHistory();
    }

    setDrawing(false);
    currentStroke.current=[];
    setShapeStart(null);
    setShapeEnd(null);
  };

  return(
    <div className="board-container">
<TopBar
  onUndo={undo}
  onRedo={redo}
  onClear={clearBoard}
  onSave={handleSave}
  onFullscreen={goFullscreen}
/>



      <Toolbar
        tool={tool}
        selectSelect={()=>{selectSelect();setPanelOpen(false);setShapePanelOpen(false);}}
        selectPen={()=>{selectPen();setPanelOpen(true);setShapePanelOpen(false);}}
        selectEraser={()=>{selectEraser();setPanelOpen(true);setShapePanelOpen(false);}}
        selectShape={()=>{selectShape();setPanelOpen(false);setShapePanelOpen(p=>!p);}}
        selectText={()=>{selectText();setPanelOpen(false);setShapePanelOpen(false);}}
      />

      {tool==="pen" && panelOpen && (
        <PenPanel setColor={setColor} setSize={setSize} color={color}/>
      )}

      {tool==="eraser" && panelOpen && (
  <EraserPanel
    setEraserSize={setEraserSize}
    closePanel={()=>setPanelOpen(false)}
  />
)}


      {tool==="shape" && shapePanelOpen && (
        <Shape selectedShape={selectedShape} setSelectedShape={setSelectedShape}/>
      )}

 <canvas
  ref={canvasRef}
  className="canvas"
style={{
  cursor:
    tool==="text"?"text":
    tool==="select"?"move":
    "crosshair"
}}



 onPointerDown={e=>{
  if(e.button===1 || e.shiftKey){
    startPan(e);
    
    return;
  }

  const pos=getPos(e);

  if(tool==="select"){
  selectLogic.pointerDown(pos);
  redrawAll();  //  FORCE UI UPDATE
}

  else startDraw(e);
}}

onPointerMove={e=>{
  if(panning.current){
    movePan(e);
    return;
  }

  const pos=getPos(e);

  if(tool==="select") selectLogic.pointerMove(pos);
  else draw(e);
}}

 onPointerUp={()=>{
  stopPan();

  if(tool==="select") selectLogic.pointerUp();
  else stopDraw();
  if(tool==="eraser") {
saveHistory();
  }
}}


  onClick={e=> tool==="text" && handleCanvasClick(e)}

  // double click to edit text
  onDoubleClick={(e)=>{
    if(tool!=="select") return;

    const pos=getPos(e);

    const found=[...strokes.current]
      .reverse()
      .find(s=>selectLogic.hitTest(pos,s));

    if(found && found.type==="text"){
      setEditing({
        x:found.x,
        y:found.y,
        text:found.text,
        size:found.size,
        existing:found
      });
    }
  }}
/>
{selectLogic.selected.current?.type==="text" && (
  <div style={{
  position:"absolute",

  //  attach to text position
  top:
    selectLogic.selected.current.y * scale.current +
    offset.current.y - 45,

  left:
    selectLogic.selected.current.x * scale.current +
    offset.current.x,

  background:"#fff",
  padding:"6px 10px",
  borderRadius:8,
  display:"flex",
  gap:6,
  boxShadow:"0 2px 6px rgba(0,0,0,0.2)"
}}


  >

    <button onClick={()=>{
      const t=selectLogic.selected.current;
      t.size=42;
      t.style="heading";
      redrawAll();
    }}>
      H1
    </button>

    <button onClick={()=>{
      const t=selectLogic.selected.current;
      t.size=26;
      t.style="subheading";
      redrawAll();
    }}>
      H2
    </button>

  </div>
)}
{editing && (
  <textarea
    autoFocus
    value={editing.text}

    onChange={e=>
      setEditing({...editing,text:e.target.value})
    }

    onBlur={saveText}

    onKeyDown={e=>{
      if(e.key==="Enter"){
        e.preventDefault();
        saveText();
      }
      if(e.key==="Escape"){
        setEditing(null);
      }
    }}

 style={{
  position:"absolute",
  
left: editing.x * scale.current + offset.current.x,
top: editing.y * scale.current + offset.current.y,
fontSize:(editing.size||20)*scale.current,

  
  border:"2px solid #333",
  padding:4,
  background:"#fff",
  outline:"none",
  zIndex:1000
}}

  />
)}


    </div>
  );
}

export default Board;
