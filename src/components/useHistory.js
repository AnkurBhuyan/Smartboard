import { useRef } from "react";

export default function useHistory(strokes, redrawAll){

  const history = useRef([]);
  const index = useRef(-1);

  const clone = (d)=>JSON.parse(JSON.stringify(d));

  // SAVE STATE
  const saveHistory = () => {

    const snapshot = clone(strokes.current);

    // remove future states if drawing after undo
    history.current = history.current.slice(0,index.current+1);

    history.current.push(snapshot);

    // limit size
    if(history.current.length>50){
      history.current.shift();
    } else {
      index.current++;
    }
  };

  // UNDO
  const undo = () => {
    if(index.current <= 0) return;

    index.current--;

    strokes.current = clone(
      history.current[index.current]
    );

    redrawAll();
  };

  // REDO
  const redo = () => {
    if(index.current >= history.current.length-1) return;

    index.current++;

    strokes.current = clone(
      history.current[index.current]
    );

    redrawAll();
  };

  // CLEAR
  const clearBoard = () => {
    saveHistory();
    strokes.current=[];
    redrawAll();
  };

  return {
    saveHistory,
    undo,
    redo,
    clearBoard
  };
}
