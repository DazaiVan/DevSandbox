import { Canvas } from "@react-three/fiber";
import Settings from "./Settings/Settings";
import TestCube from "./auxiliaryModel/TestCube.jsx";
import LoaderGLBModel from "./Loader/LoaderGLBModel.js";
import { useGLTF ,AdaptiveDpr  } from '@react-three/drei';
import { Suspense } from 'react';
import { LoadingIndicator } from "./Settings/LoadingIndicator.js";
interface SceneProps{

}
useGLTF.preload('/emo_robot.glb')
function Scene({ }:SceneProps) {
  return (
    <Canvas camera={{ far: 5000 }}>
      <Suspense fallback={<LoadingIndicator />}>
            <Settings />
      <LoaderGLBModel url={'/emo_robot.glb'} />
        {/* <TestCube /> */}
        <AdaptiveDpr pixelated />
      </Suspense>

    </Canvas>
  );
}

export default Scene;
