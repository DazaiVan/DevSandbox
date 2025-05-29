import { OrbitControls } from "@react-three/drei";

interface OrbitControlSceneProps {
  //
  control?: {
    
  }
  //

}

function OrbitControlScene({ control = {} }: OrbitControlSceneProps) {
  return (
    <>
      <OrbitControls
      {...control} 
      />
    </>
  );
}

export default OrbitControlScene;
