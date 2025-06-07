import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree, useLoader } from '@react-three/fiber';
import { ObjectLoader } from 'three';
import { Edges, useGLTF } from '@react-three/drei';
interface LoaderGLBModelProps {
  url: string;
  position?: [number, number, number];
}

function LoaderGLBModel({ url, position = [0, 0, 0] }: LoaderGLBModelProps) {
  const { scene:model } = useGLTF(url);
  // const model = useLoader(ObjectLoader, "/router.json");
  const groupRef = useRef<THREE.Group>(null);
  const { camera, scene } = useThree();
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  // // Проверка видимости объекта
  // const checkVisibility = (mesh: THREE.Mesh) => {
  //   if (!groupRef.current || !camera) return;

  //   const frustum = new THREE.Frustum();
  //   const cameraMatrix = new THREE.Matrix4().multiplyMatrices(
  //     camera.projectionMatrix,
  //     camera.matrixWorldInverse
  //   );
  //   frustum.setFromProjectionMatrix(cameraMatrix);

  //   const isVisible = frustum.intersectsObject(mesh);
  //   mesh.visible = isVisible;
  // };

  // useFrame(() => {
  //   if (groupRef.current) {
  //     groupRef.current.traverse((child) => {
  //       if (child instanceof THREE.Mesh) {
  //         checkVisibility(child);
  //       }
  //     });
  //   }
  // });

  // const processedScene = useMemo(() => {
  //   const clone = scene.clone();
  //   return clone;
  // }, [scene]);

  interface HandleClickEvent {
    object: THREE.Object3D;
    [key: string]: any;
  }

  const handleClick = (event: HandleClickEvent) => {
    event.stopPropagation()
    console.log("Объект кликнут!", event.object);
    console.log("uuid", event.object.uuid);
    console.log("userData", event.object.userData);
    if (selectedObject !== null) {
      scene.remove(selectedObject)
    }
    const box = new THREE.BoxHelper(event.object, 0xffff00);
    box.material.depthTest = false
    scene.add(box)
    setSelectedObject(box);

  };
  return (

    <group name='Main' ref={groupRef} position={position} onClick={handleClick}>
      {/* <primitive object={processedScene}/> */}
       <primitive object={model}/>
      {/* <primitive object={model} /> */}
    </group>



  );
}

export default LoaderGLBModel;









