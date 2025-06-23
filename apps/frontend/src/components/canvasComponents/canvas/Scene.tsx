import { useRef } from 'react';
import { Canvas, extend, ThreeToJSXElements } from "@react-three/fiber";
import Settings from "./Settings/Settings";
import TestCube from "./auxiliaryModel/TestCube.jsx";
import LoaderGLBModel from "./Loader/LoaderGLBModel.js";
import { useGLTF, AdaptiveDpr } from '@react-three/drei';
import { Suspense } from 'react';
import { LoadingIndicator } from "./Settings/LoadingIndicator.js";
import * as THREE from 'three/webgpu';
import * as TSL from 'three/tsl'
interface SceneProps {}
declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}
useGLTF.preload('/scene.glb');
extend(THREE as any)
function Scene({}: SceneProps) {


  return (
    <Canvas
    gl={async (props) => {
      const renderer = new THREE.WebGPURenderer(props as any)
      await renderer.init()
      return renderer
    }}
      camera={{ far: 5000 }}
    >
      <Suspense fallback={<LoadingIndicator />}>
        <Settings />
        <LoaderGLBModel url={'/scene.glb'} />
        <AdaptiveDpr pixelated />
      </Suspense>
    </Canvas>
  );
}

export default Scene;