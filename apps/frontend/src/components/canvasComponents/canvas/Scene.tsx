import { Canvas } from "@react-three/fiber";
import Settings from "./Settings/Settings";
import TestCube from "./auxiliaryModel/TestCube.jsx";

interface SceneProps{

}

function Scene({ }:SceneProps) {
  return (
    <Canvas>
      <Settings />
      <TestCube />
    </Canvas>
  );
}

export default Scene;
