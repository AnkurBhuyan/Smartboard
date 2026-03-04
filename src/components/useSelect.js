import { useRef, useEffect } from "react";

export default function useSelect(strokes, redrawAll,notifyChange) {

  const selected = useRef(null);
  const dragging = useRef(false);
  const resizing = useRef(false);

  const offset = useRef({x:0,y:0});

  const HANDLE_SIZE = 12;

  // ===== DELETE KEY =====
  useEffect(()=>{
    const handleKeyDown=(e)=>{
      if(e.key==="Delete" && selected.current){
        const i=strokes.current.indexOf(selected.current);
        if(i>-1){
          strokes.current.splice(i,1);
          selected.current=null;
          redrawAll();
        }
      }
    };

    window.addEventListener("keydown",handleKeyDown);
    return ()=>window.removeEventListener("keydown",handleKeyDown);
  },[redrawAll,strokes]);


  // ===== HIT TEST =====
  const hitTest=(pos,s)=>{

    // TEXT
    if(s.type==="text"){
      return (
        pos.x>=s.x &&
        pos.x<=s.x+s.width &&
        pos.y>=s.y &&
        pos.y<=s.y+s.height
      );
    }

    // SHAPES
    if(s.start && s.end){
      return (
        pos.x>=Math.min(s.start.x,s.end.x) &&
        pos.x<=Math.max(s.start.x,s.end.x) &&
        pos.y>=Math.min(s.start.y,s.end.y) &&
        pos.y<=Math.max(s.start.y,s.end.y)
      );
    }

    // PEN
    if(s.points){
      return s.points.some(p =>
        Math.hypot(p.x-pos.x,p.y-pos.y) < 10
      );
    }

    return false;
  };


  // ===== HANDLE HIT TEST =====
const onHandle=(pos,s)=>{
  if(s.type!=="text") return false;

  const hx = s.x + s.width;
  const hy = s.y + s.height;

  const hitSize = 20; // ⭐ bigger = easier

  return (
    pos.x >= hx - hitSize &&
    pos.x <= hx + hitSize &&
    pos.y >= hy - hitSize &&
    pos.y <= hy + hitSize
  );
};


  // ===== POINTER DOWN =====

const pointerDown=(pos)=>{
  const found=[...strokes.current]
    .reverse()
    .find(s=>hitTest(pos,s));

  if(!found){
    selected.current=null;
    notifyChange();
    redrawAll();
    return;
  }

  selected.current=found;
  notifyChange();

  // RESIZE (text only)
  if(onHandle(pos,found)){
    resizing.current=true;
    dragging.current=false;
    return;
  }

  dragging.current=true;

  // ⭐ SAVE OFFSET FOR ALL TYPES
  if(found.type==="text"){
    offset.current={
      x:pos.x-found.x,
      y:pos.y-found.y
    };
  }

  else if(found.start){ // shape
    offset.current={
      x:pos.x-found.start.x,
      y:pos.y-found.start.y
    };
  }

  else if(found.points){ // pen
    offset.current={
      x:pos.x-found.points[0].x,
      y:pos.y-found.points[0].y
    };
  }
};





  // ===== POINTER MOVE =====
const pointerMove=(pos)=>{
  if(!selected.current) return;

  const s=selected.current;

  // ===== RESIZE TEXT =====
  if(resizing.current && s.type==="text"){
    s.width = Math.max(40,pos.x-s.x);
    s.height = Math.max(20,pos.y-s.y);
    s.size = Math.max(12, s.height*0.8);
    redrawAll();
    return;
  }

  // ===== MOVE =====
  if(dragging.current){

    // TEXT
    if(s.type==="text"){
      s.x=pos.x-offset.current.x;
      s.y=pos.y-offset.current.y;
    }

    // SHAPES
    else if(s.start && s.end){
      const dx = pos.x-offset.current.x - s.start.x;
      const dy = pos.y-offset.current.y - s.start.y;

      s.start.x += dx;
      s.start.y += dy;
      s.end.x += dx;
      s.end.y += dy;
    }

    // PEN
    else if(s.points){
      const dx = pos.x-offset.current.x - s.points[0].x;
      const dy = pos.y-offset.current.y - s.points[0].y;

      s.points.forEach(p=>{
        p.x += dx;
        p.y += dy;
      });
    }

    redrawAll();
  }
};


  // ===== POINTER UP =====
  const pointerUp=()=>{
    dragging.current=false;
    resizing.current=false;
  };


  return {
    pointerDown,
    pointerMove,
    pointerUp,
    hitTest,
    selected
  };
}
