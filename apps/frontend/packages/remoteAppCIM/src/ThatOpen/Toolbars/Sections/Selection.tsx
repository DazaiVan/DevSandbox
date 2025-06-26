import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as FRAGS from "@thatopen/fragments";
import * as CUI from "@thatopen/ui-obc";
import {FragmentIdMap} from "@thatopen/fragments";
import {AppManager} from "../../AppManager/AppManager";
import EyeFilled from '../../../icons/tabler--eye-filled.svg'
import SquareToggle from '../../../icons/tabler--square-toggle.svg'
import FilterFill from '../../../icons/prime--filter-fill.svg'
import FocusMode from '../../../icons/ri--focus-mode.svg'
import DocumentBold from '../../../icons/solar--document-bold.svg'

export default function Selection(components: OBC.Components, world?: OBC.World)  {
  const highlighter = components.get(OBF.Highlighter);
  const hider = components.get(OBC.Hider);
  const fragments = components.get(OBC.FragmentsManager);
  const cullers = components.get(OBC.Cullers);
  const streamer = components.get(OBF.IfcStreamer);
  const appManager = components.get(AppManager);
  const viewportGrid = appManager.grids.get("viewport");

  const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
    components,
    fragmentIdMap: {},
  });

  propsTable.preserveStructureOnFilter = true;
  fragments.onFragmentsDisposed.add(() => updatePropsTable());

  const onToggleVisibility = () => {
    const selection = highlighter.selection.select;
    if (Object.keys(selection).length === 0) {
      return;
    }
    const meshes = new Set<THREE.InstancedMesh>();

    const streamedFrags: FRAGS.FragmentIdMap = {};

    for (const fragmentID in selection) {
      const fragment = fragments.list.get(fragmentID);
      if (!fragment) continue;

      if (fragment.group?.isStreamed) {
        streamedFrags[fragmentID] = selection[fragmentID];
        continue;
      }

      meshes.add(fragment.mesh);
      const expressIDs = selection[fragmentID];
      for (const id of expressIDs) {
        const isHidden = fragment.hiddenItems.has(id);
        fragment.setVisibility(isHidden, [id]);
      }
    }

    if (meshes.size) {
      cullers.updateInstanced(meshes);
    }

    if (Object.keys(streamedFrags).length) {
      for (const fragmentID in streamedFrags) {
        const fragment = fragments.list.get(fragmentID);
        if (!fragment) continue;
        const ids = streamedFrags[fragmentID];

        for (const id of ids) {
          const isHidden = fragment.hiddenItems.has(id);
          streamer.setVisibility(isHidden, { [fragment.id]: new Set([id]) });
        }
      }
    }
  };

  const onIsolate = () => {
    const selection = highlighter.selection.select;
    if (Object.keys(selection).length === 0) return;

    const meshes = new Set<THREE.InstancedMesh>();

    const streamedFragsToHide: FRAGS.FragmentIdMap = {};
    const streamedFragsToShow: FRAGS.FragmentIdMap = {};
    const staticFragsToShow: FRAGS.FragmentIdMap = {};

    for (const [, fragment] of fragments.list) {
      if (fragment.group?.isStreamed) {
        streamedFragsToHide[fragment.id] = new Set(fragment.ids);
        continue;
      }

      fragment.setVisibility(false);
      meshes.add(fragment.mesh);
    }

    for (const fragmentID in selection) {
      const fragment = fragments.list.get(fragmentID);
      if (!fragment) {
        continue;
      }
      if (fragment.group?.isStreamed) {
        streamedFragsToShow[fragmentID] = selection[fragmentID];
      } else {
        staticFragsToShow[fragmentID] = selection[fragmentID];
      }
    }

    if (Object.keys(staticFragsToShow).length) {
      hider.set(true, selection);
      cullers.updateInstanced(meshes);
    }

    if (
      Object.keys(streamedFragsToHide).length ||
      Object.keys(streamedFragsToShow).length
    ) {
      streamer.setVisibility(false, streamedFragsToHide);
      streamer.setVisibility(true, streamedFragsToShow);
    }
  };

  const onShowAll = () => {
    const streamedFragsToShow: FRAGS.FragmentIdMap = {};

    for (const [, fragment] of fragments.list) {
      if (fragment.group?.isStreamed) {
        streamedFragsToShow[fragment.id] = new Set(fragment.ids);
        continue;
      }

      fragment.setVisibility(true);
      const cullers = components.get(OBC.Cullers);
      for (const [, culler] of cullers.list) {
        const culled = culler.colorMeshes.get(fragment.id);
        if (culled) culled.count = fragment.mesh.count;
      }
    }

    if (Object.keys(streamedFragsToShow).length) {
      streamer.setVisibility(true, streamedFragsToShow);
    }
  };

  const onFocusSelection = async () => {
    if (!world) return;
    if (!world.camera.hasCameraControls()) return;

    const bbox = components.get(OBC.BoundingBoxer);
    const fragments = components.get(OBC.FragmentsManager);
    bbox.reset();

    const selected = highlighter.selection.select;
    if (!Object.keys(selected).length) return;

    for (const fragID in selected) {
      const fragment = fragments.list.get(fragID);
      if (!fragment) continue;
      const ids = selected[fragID];
      bbox.addMesh(fragment.mesh, ids);
    }

    const sphere = bbox.getSphere();
    const i = Infinity;
    const mi = -Infinity;
    const { x, y, z } = sphere.center;
    const isInf = sphere.radius === i || x === i || y === i || z === i;
    const isMInf = sphere.radius === mi || x === mi || y === mi || z === mi;
    const isZero = sphere.radius === 0;
    if (isInf || isMInf || isZero) {
      return;
    }

    sphere.radius *= 1.2;
    const camera = world.camera;
    await camera.controls.fitToSphere(sphere, true);
  };

  function onEntityAttribute(this: HTMLButtonElement, fragmentIdMap: FragmentIdMap) {
    const isActive = this.style.backgroundColor === 'var(--bim-ui_main-base)';
    this.style.backgroundColor = isActive ? '' : 'var(--bim-ui_main-base)';

    if (isActive) {
      updatePropsTable({ fragmentIdMap: {} });
      if (!viewportGrid) return;
      viewportGrid.layout = "main";
    } else {
      if (!viewportGrid) return;
      viewportGrid.layout = "second";
      propsTable.expanded = false;
      updatePropsTable({ fragmentIdMap });
    }
  }


  return BUI.Component.create<BUI.PanelSection>(() => {
    return BUI.html`
      <bim-toolbar-section label="Управление моделью">
        <div
        style="
            display: flex;
            flex-direction: column;
            justify-content: ;
        ">
            <div>
            <bim-button @click=${onShowAll} class="Bim-button-style" label="Показать всё" tooltip-title="Показать всё" tooltip-text="Показывает все элементы во всех моделях.">
                <img class="icon-style" src=${EyeFilled} alt="EyeFilled"/>
            </bim-button>
            <bim-button @click=${onToggleVisibility} class="Bim-button-style" label="Скрыть / Показать" tooltip-title="Переключение видимости" tooltip-text="Из текущего выбора скрывает видимые элементы и показывает скрытые элементы.">
                <img class="icon-style" src=${SquareToggle} alt="SquareToggle"/>
            </bim-button>
            </div>
        </div>
        <div >
            <bim-button @click=${onIsolate} class="Bim-button-style" label="Изолировать структуру" tooltip-title="Изоляция" tooltip-text="Изолирует текущий выбор.">
                <img class="icon-style" src=${FilterFill} alt="FilterFill"/>
            </bim-button>
            <bim-button @click=${onFocusSelection} class="Bim-button-style" label="Фокус на структуре" tooltip-title="Фокус" tooltip-text="Фокусирует камеру на текущем выделенном объекте.">
                <img class="icon-style" src=${FocusMode} alt="FocusMode"/>
            </bim-button>
        </div>
        <div>
            <bim-button  id="EntityAttribute" @click=${onEntityAttribute} class="Bim-button-style" label="Атрибуты сущности">
                <img class="icon-style" src=${DocumentBold} alt="DocumentBold"/>
            </bim-button>
        </div>
      </bim-toolbar-section> 
    `;
  });
};



// <bim-toolbar-section label="Управление моделью" icon="ph:cursor-fill">
// <div
//     style="
// display: flex;
// flex-direction: column;
// justify-content: ;
// ">
// <div>
// <bim-button @click=${onShowAll} label="Показать всё" icon="tabler:eye-filled" tooltip-title="Показать всё" tooltip-text="Показывает все элементы во всех моделях."></bim-button>
//     <bim-button @click=${onToggleVisibility} label="Скрыть / Показать" icon="tabler:square-toggle" tooltip-title="Переключение видимости" tooltip-text="Из текущего выбора скрывает видимые элементы и показывает скрытые элементы."></bim-button>
//     </div>
//     </div>
//     <div >
//     <bim-button @click=${onIsolate} label="Изолировать структуру" icon="prime:filter-fill" tooltip-title="Изоляция" tooltip-text="Изолирует текущий выбор."></bim-button>
//     <bim-button @click=${onFocusSelection} label="Фокус на структуре" icon="ri:focus-mode" tooltip-title="Фокус" tooltip-text="Фокусирует камеру на текущем выделенном объекте."></bim-button>
//     </div>
//     <div>
//     <bim-button  id="EntityAttribute" @click=${onEntityAttribute} label="Атрибуты сущности" icon="solar:document-bold" ></bim-button>
//     </div>
//     </bim-toolbar-section>
