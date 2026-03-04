import {
  FaSquare,
  FaCircle,
  FaSlash,
  FaLongArrowAltRight,
  FaPlay
} from "react-icons/fa";

import "./Shape.css";

function Shape({ selectedShape, setSelectedShape }) {

  const shapes = [
    { name: "rectangle", icon: <FaSquare size={22}/> },
    { name: "circle", icon: <FaCircle size={22}/> },
    { name: "line", icon: <FaSlash size={22}/> },
    { name: "arrow", icon: <FaLongArrowAltRight size={22}/> },
    { name: "triangle", icon: <FaPlay size={22}/> }
  ];

  return (
    <div className="shape-panel">
      {shapes.map(shape => (
        <button
          key={shape.name}
          className={`shape-btn ${selectedShape===shape.name?"active":""}`}
          onClick={()=>setSelectedShape(shape.name)}
        >
          {shape.icon}
        </button>
      ))}
    </div>
  );
}

export default Shape;
