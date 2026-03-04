import { useState } from "react";

export default function useToolbar(){

  const [tool,setTool] = useState("pen");

  const selectSelect = ()=>setTool("select"); //  ADD
  const selectPen = ()=>setTool("pen");
  const selectEraser = ()=>setTool("eraser");
  const selectShape = ()=>setTool("shape");
  const selectText = ()=>setTool("text");

  return {
    tool,
    selectSelect, //  RETURN
    selectPen,
    selectEraser,
    selectShape,
    selectText
  };
}
