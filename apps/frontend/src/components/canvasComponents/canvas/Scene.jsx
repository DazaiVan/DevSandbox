import { Canvas } from "@react-three/fiber"
import Settings from "./Settings/Settings"
import "./Scene.css";
import TestCube from "./auxiliaryModel/TestCube";

function Scene() {

  return (

      <Canvas>
      <Settings />
      <TestCube/>
      </Canvas>
    
  )
}

export default Scene
