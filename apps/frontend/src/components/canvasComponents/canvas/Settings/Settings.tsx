import AmbientLightScene from "./light/AmbientLightScene";
import OrbitControlScene from "./сontrol/OrbitControlScene";

interface SettingsProps {
  //

  //
}

function Settings({ }: SettingsProps){
  const settingsObject = {
    AmbientLightSceneSettings: {
      intensity:1
    }
  }
  return (
    <>
        <AmbientLightScene light={{ intensity: settingsObject.AmbientLightSceneSettings.intensity }} />
        <OrbitControlScene/>
    </>

  )
}

export default Settings;
