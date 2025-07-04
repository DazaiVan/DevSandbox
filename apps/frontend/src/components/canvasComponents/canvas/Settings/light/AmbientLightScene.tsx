interface AmbientLightSceneProps {
  //
  light?: {
    intensity?: number;
  }; 
  //

}

function AmbientLightScene({ light = {} } : AmbientLightSceneProps){
  return (
    <ambientLight {...light} />
  );
}

export default AmbientLightScene;
