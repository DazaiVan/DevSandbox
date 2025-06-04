import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

interface LoaderGLBModelProps  {
  url: string;
  position?: [number, number, number];
};

function LoaderGLBModel({ url, position = [0, 0, 0]}: LoaderGLBModelProps) {
  const { scene } = useGLTF(url)
  return (
    <Suspense fallback={null}>
      <primitive 
        object={scene} 
        position={position} 
      />
    </Suspense>
  );
}
export default LoaderGLBModel

