
import * as CUI from "@thatopen/ui-obc";
import Box3d from '../../icons/mage--box-3d-fill.svg'
import Tree from '../../icons/ph--tree-structure-fill.svg'
import Expand from '../../icons/eva--expand-fill.svg'
import {useEffect, useRef} from "react";
import {Button, Divider, Input} from "antd";
import {SearchProps} from "antd/es/input";
import {observer} from "mobx-react-lite";
import Groupings from "./Sections/Groupings";
import { useStore } from "../../stores/StoreProvider";

const { Search } = Input;
// export default (components: OBC.Components, classificationsTree: BUI.Table<BUI.TableRowData<Record<string, BUI.TableCellValue>>>) => {
const ProjectInformation = observer(() => {
    const store = useStore();
    const components = store.sceneStore.getComponents
    // const appManager = components.get(AppManager);
    // const viewportGrid = appManager.grids.get("viewport");
    const modelsListRef = useRef<HTMLDivElement>(null);
    const relationsTreeRef = useRef<HTMLDivElement>(null);
    const [modelsList] = CUI.tables.modelsList({ components });
    const [relationsTree] = CUI.tables.relationsTree({
    components,
    models: [],
    hoverHighlighterName: "hover",
    selectHighlighterName: "select",
  });
    useEffect(() => {
        if (modelsListRef.current && modelsList instanceof HTMLElement) {
            modelsListRef.current.innerHTML = "";
            modelsListRef.current.appendChild(modelsList);
        }
    }, [modelsList]);
    useEffect(() => {
        if (relationsTreeRef.current && relationsTree instanceof HTMLElement) {
            relationsTreeRef.current.innerHTML = "";
            relationsTreeRef.current.appendChild(relationsTree);
        }
    }, [relationsTree]);

  relationsTree.preserveStructureOnFilter = true;
  relationsTree.addEventListener('click', () => {
      const entityButton = document.getElementById('EntityAttribute');
      if(entityButton)
      entityButton.setAttribute('disabled','');
      // if (!viewportGrid) return;
      // viewportGrid.layout = "main";
    });

  const search: SearchProps['onSearch']  = (e) => {
      relationsTree.queryString = e.toString();
  };
  document.addEventListener('DOMContentLoaded',()=>{
    const doda = document.querySelectorAll('bim-label[icon="ph\\:tree-structure-fill"]')
    console.log(doda)
  })

    return (
        <div>
            <div>
                <div className={"TitleWithIcon"}>
                    <img style={{height: '14px'}} src={Box3d} alt="Box3d"/>
                    <p style={{marginLeft: '0.2rem'}}>Загруженные модели</p>
                </div>
                <div ref={modelsListRef}/>
            </div>
            <Divider />
            <div>
                <div className={"TitleWithIcon"}>
                <img style={{height: "14px"}} src={Tree} alt="Tree"/>
                <p style={{marginLeft: "0.2rem"}}>Структуры</p>
                </div>
                <div style={{display: "flex", gap: "0.375rem"}}>
                    <Search onSearch={search} placeholder="Поиск..." enterButton/>
                    <Button style={{flex: 0}} onClick={()=>(relationsTree.expanded = !relationsTree.expanded)}>
                      <img height={"14px"} src={Expand} alt="World"/>
                    </Button>        
                </div>
            <div id="relations-tree">
                <div ref={relationsTreeRef}/>
            </div>
            <Divider />
            </div>
                <Groupings/>
        </div>
    );

});
export default ProjectInformation;
        // <bim-panel-section label="Classifications tree" icon="ph:tree-structure-fill">
        // ${classificationsTree
//
//   // return BUI.Component.create<BUI.Panel>(() => {
//   //   return BUI.html`
//   //     <bim-panel>
//   //       <bim-panel-section >
//   //           <div class="TitleWithIcon">
//   //               <img style="height: 14px" src=${Box3d} alt="Box3d"/>
//   //               <p style="margin-left: 0.2rem">Загруженные модели</p>
//   //           </div>
//   //         ${modelsList}
//   //       </bim-panel-section>
//   //       <bim-panel-section>
//   //           <div class="TitleWithIcon">
//   //               <img style="height: 14px" src=${Tree} alt="Tree"/>
//   //               <p style="margin-left: 0.2rem">Структуры</p>
//   //           </div>
//   //           <div style="display: flex; gap: 0.375rem;">
//   //             <bim-text-input @input=${search} vertical placeholder="Поиск..." debounce="200"></bim-text-input>
//   //             <button
//   //               onmouseover="this.style.backgroundColor = 'var(--bim-ui_accent-base)'"
//   //               onmouseout="this.style.backgroundColor = 'var(--bim-ui_bg-contrast-20)'"
//   //               style="
//   //                 width: 28px ;
//   //                 height: 28px;
//   //                 display: flex;
//   //                 justify-content: center;
//   //                 border: 0px;
//   //                 border-radius: 15%;
//   //                 background-color: var(--bim-ui_bg-contrast-20);
//   //                 transition: 0.15s"
//   //               @click=${() => (relationsTree.expanded = !relationsTree.expanded)}>
//   //               <img style=" width: 14px;" src=${Expand} alt=""/>
//   //             </button>
//   //           </div>
//   //         <div id="relations-tree">
//   //         ${relationsTree}
//   //         </div>
//   //       </bim-panel-section>
//   //
//   //       ${groupings(components)}
//   //
//   //       </bim-panel-section>
//   //     </bim-panel>
//   //   `;
//   // });}