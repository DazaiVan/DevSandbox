// import React from 'react';
// import { Vector3 } from '@babylonjs/core/Maths/math.vector';
// import { Engine, Scene, Model } from 'react-babylonjs';
// import "@babylonjs/loaders";

// const CanvasBabylon = () => {
//   return (
//     <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
//       <Engine antialias adaptToDeviceRatio canvasId="babylon-js">
//         <Scene>
//           <arcRotateCamera
//             name="arcCam"
//             alpha={-Math.PI / 2}
//             beta={Math.PI / 2.5}
//             radius={10}
//             target={Vector3.Zero()}
//             lowerRadiusLimit={5}
//             upperRadiusLimit={20}
//             lowerBetaLimit={0.1}
//             upperBetaLimit={(Math.PI / 2) * 0.9}
//             pinchPrecision={50}
//             angularSensibilityX={300}
//             angularSensibilityY={300}
//             wheelPrecision={50}
//           />
//           <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
//           <Model
//             name="my-model"
//             rootUrl={'/'}
//             sceneFilename="emo_robot.glb"
//             scaleToDimension={5}
//             position={new Vector3(0, 0, 0)}
//           />
//         </Scene>
//       </Engine>
//     </div>
//   );
// };

// export default CanvasBabylon;
import React from 'react';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Engine, Scene,Model } from 'react-babylonjs';
import "@babylonjs/loaders";
const CanvasBabylon = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh',
      touchAction: 'none' // Важно для тач-устройств
    }}>
      <Engine antialias adaptToDeviceRatio canvasId="babylon-js">
        <Scene>
          <arcRotateCamera
            name="arcCam"
            alpha={-Math.PI / 2}
            beta={Math.PI / 4}
            radius={10}
            target={Vector3.Zero()}
            attachControl={true} // Ключевой параметр!
          />
          
          <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
          
                   <Model
            name="my-model"
            rootUrl={'/'}
            sceneFilename="emo_robot.glb"
            scaleToDimension={5}
            position={new Vector3(0, 0, 0)}
          />
        </Scene>
      </Engine>
    </div>
  );
};

export default CanvasBabylon;