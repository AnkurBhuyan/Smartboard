import { useCallback } from "react";

export default function useEraser({
  strokes,
  eraserSize,
  redrawAll
}) {

  const eraseAt = useCallback((pos)=>{

    const r = eraserSize || 20;

    const newStrokes = [];

    strokes.current.forEach(s=>{

      
      // ✏️ PEN — SMOOTH RUB
      
      if (s.points){

        let segment = [];

        s.points.forEach(p=>{

          const d = Math.hypot(p.x-pos.x, p.y-pos.y);

          if (d > r){
            segment.push(p);
          }
          else{
            // break stroke when rubbing
            if (segment.length>3){
              newStrokes.push({
                ...s,
                points:segment
              });
            }
            segment=[];
          }

        });

        if (segment.length>3){
          newStrokes.push({
            ...s,
            points:segment
          });
        }

        return;
      }

     
      // TEXT OBJECT ERASE
      
      if (s.type==="text"){

        const hit =
          pos.x>=s.x-r &&
          pos.x<=s.x+(s.width||50)+r &&
          pos.y>=s.y-s.size-r &&
          pos.y<=s.y+r;

        if (!hit) newStrokes.push(s);
        return;
      }

      //  SHAPES  OBJECT ERASE
     
      if (s.type && s.start){

        const minX=Math.min(s.start.x,s.end.x);
        const maxX=Math.max(s.start.x,s.end.x);
        const minY=Math.min(s.start.y,s.end.y);
        const maxY=Math.max(s.start.y,s.end.y);

        const hit =
          pos.x>=minX-r &&
          pos.x<=maxX+r &&
          pos.y>=minY-r &&
          pos.y<=maxY+r;

        if (!hit) newStrokes.push(s);
        return;
      }

      newStrokes.push(s);

    });

    strokes.current = newStrokes;

    redrawAll();

  },[eraserSize, redrawAll, strokes]);

  return { eraseAt };
}
