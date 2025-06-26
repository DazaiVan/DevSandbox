import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import FitScreen from '../../../icons/material-symbols--fit-screen-rounded.svg'
import Locked from '../../../icons/tabler--lock-filled.svg'
import Unlocked from '../../../icons/majesticons--unlock-open.svg'
import {observer} from "mobx-react-lite";

const Camera = observer((world: OBC.World) => {
  const { camera } = world;

  const onFitModel = () => {
    if (camera instanceof OBC.OrthoPerspectiveCamera && world.meshes.size > 0) {
      camera.fit(world.meshes, 0.5);
    }
  };

  const onLock = (e: Event) => {
    const button = e.target as BUI.Button;
    const lock = document.getElementById('LockFilled')
    camera.enabled = !camera.enabled;
    button.active = !camera.enabled;
    button.label = camera.enabled ? "Заблокировать вращение" : "Разблокировать вращение";
    // @ts-ignore
    lock.src = camera.enabled ? Locked : Unlocked;
    // button.icon = camera.enabled
    //   ? "tabler:lock-filled"
    //   : "majesticons:unlock-open";
  };

  // const onProjectionDropdownCreated = (e?: Element) => {
  //   if (!(e && camera instanceof OBC.OrthoPerspectiveCamera)) return;
  //   const dropdown = e as BUI.Dropdown
  //   dropdown.value = [camera.projection.current]
  // }

  // const onProjectionChange = (e: Event) => {
  //   if (!(camera instanceof OBC.OrthoPerspectiveCamera)) return
  //   const dropdown = e.target as BUI.Dropdown
  //   const value = dropdown.value[0]
  //   console.log(value)
  //   camera.projection.set(value)
  // }
  return (
      <div>
        <div>
          <button onClick={onFitModel} >
            Центрировать камеру
            <img className={'icon-style'} src={FitScreen} alt="FitScreen"/>
          </button>
          <button onClick={(event)=>onLock}>
            Заблокировать вращение
            <img className={'icon-style'} id='LockFilled' src={Locked} alt="LockFilled"/>
          </button>
        </div>
      </div>
)

})
export default Camera;

// return BUI.Component.create<BUI.PanelSection>(() => {
//   return BUI.html`
//       <bim-toolbar-section label="Камера" style="pointer-events: auto">
//         <div>
//           <bim-button class="Bim-button-style" label="Центрировать камеру" @click=${onFitModel}>
//             <img class="icon-style" src=${FitScreen} alt="FitScreen"/>
//           </bim-button>
//           <bim-button class="Bim-button-style" label="Заблокировать вращение" @click=${onLock} .active=${!camera.enabled}>
//             <img id='LockFilled' class="icon-style" src=${Locked} alt="LockFilled"/>
//           </bim-button>
//         </div>
//
//         <!-- <bim-dropdown required>
//           <bim-option label="Perspective"></bim-option>
//           <bim-option label="Orthographic"></bim-option>
//         </bim-dropdown> -->
//       </bim-toolbar-section>
//     `;
// });


// <bim-toolbar-section label="Камера" icon="ph:camera-fill" style="pointer-events: auto">
//     <div>
//         <bim-button label="Центрировать камеру" icon="material-symbols:fit-screen-rounded" @click=${onFitModel}></bim-button>
// <bim-button label="Заблокировать вращение" icon="tabler:lock-filled" @click=${onLock} .active=${!camera.enabled}></bim-button>
// </div>
//
//         <!-- <bim-dropdown required>
// <bim-option label="Perspective"></bim-option>
//     <bim-option label="Orthographic"></bim-option>
//     </bim-dropdown> -->
//     </bim-toolbar-section>