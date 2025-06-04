import { useGLTF } from '@react-three/drei';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';

interface LoaderGLBModelProps {
  url: string;
  position?: [number, number, number];
}

function LoaderGLBModel({ url, position = [0, 0, 0] }: LoaderGLBModelProps) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Проверка видимости объекта
  const checkVisibility = (mesh: THREE.Mesh) => {
    if (!groupRef.current || !camera) return;

    const frustum = new THREE.Frustum();
    const cameraMatrix = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    frustum.setFromProjectionMatrix(cameraMatrix);

    const isVisible = frustum.intersectsObject(mesh);
    mesh.visible = isVisible;
  };

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          checkVisibility(child);
        }
      });
    }
  });

  const processedScene = useMemo(() => {
    const clone = scene.clone();
    return clone;
  }, [scene]);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={processedScene} />
    </group>
  );
}

export default LoaderGLBModel;