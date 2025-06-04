import { Canvas } from "@react-three/fiber";
import Settings from "./Settings/Settings";
import TestCube from "./auxiliaryModel/TestCube.jsx";
import LoaderGLBModel from "./Loader/LoaderGLBModel.js";
import { useGLTF } from '@react-three/drei';

interface SceneProps{

}
useGLTF.preload('/spaces2.glb')
function Scene({ }:SceneProps) {
  return (
    <Canvas camera={{far:5000}}>
      <Settings />
      <LoaderGLBModel url={'/space2.glb'} />
      {/* <TestCube /> */}
    </Canvas>
  );
}

export default Scene;
