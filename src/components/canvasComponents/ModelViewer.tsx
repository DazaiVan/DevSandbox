import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
// import { useFrame } from '@use-gpu/workbench';
import { AutoCanvas } from '@use-gpu/webgpu';

export const ModelViewer = ({ canvas, modelPath }: { canvas: HTMLCanvasElement; modelPath: string }) => {
  const gltf = useLoader(GLTFLoader, modelPath);

//   useFrame(() => {
//     // Анимация или другие обновления кадра
//     if (gltf.scene) {
//       gltf.scene.rotation.y += 0.01;
//     }
//   });

  return (
    <AutoCanvas canvas={canvas}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <primitive object={gltf.scene} position={[0, 0, 0]} />
    </AutoCanvas>
  );
};