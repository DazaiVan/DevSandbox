import Scene from "./canvas/Scene";
import "./CanvasComponent.css";
import React, { FC } from "react";
import { LiveCanvas } from "@use-gpu/react";
import { Component } from "./Compomemt";
function CanvasComponent() {
  return (
    // <div className="canvas-container">
    //     <Scene/>
    // </div>
    <LiveCanvas>{(canvas) => <Component canvas={canvas} />}</LiveCanvas>
  );
}

// function CanvasComponent() {
//   return (
//     <WebGPU>
//       <AutoCanvas selector="#use-gpu .canvas" samples={4}></AutoCanvas>
//     </WebGPU>
//   );
// }
export default CanvasComponent;
