import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import {buffer, uuid, model, typeOfSourceModel} from "./Import";
import MageBox from '../../../icons/mage--box-3d-fill.svg'
import FluentPuzzle from '../../../icons/fluent--puzzle-cube-piece-20-filled.svg'
import {observer} from "mobx-react-lite";

import {Button, Image} from "antd";
import { useStore } from "../../../stores/StoreProvider";



const Export = observer(() => {

    const store = useStore();
    const components = store.sceneStore.getComponents;

    const propsManager = components.get(OBC.IfcPropertiesManager);
    const fragmentsExport = components.get(OBC.FragmentsManager);

    function download(file: File) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    const exportFragments = async () => {
        console.log(uuid)
        if (!fragmentsExport.groups.size) { return; }
        const group = fragmentsExport.groups.get(uuid);
        if (!group) { return; }
        const data = fragmentsExport.export(group);
        const blob = new Blob([data]);
        const file = new File([blob], `${uuid}.frag`);
        download(file);
    }

    function downloadFile (data: Uint8Array) {
        const file = new File([data], `${uuid}.ifc`);

        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(a.href);
    }


    const exportIFC = async () =>{
        switch (typeOfSourceModel) {
            case '.frag':
                const fragData = fragmentsExport.export(model);
                downloadFile(fragData);
                return
            case '.ifc':
                const modifiedBuffer = await propsManager.saveToIfc(model, buffer);
                downloadFile(modifiedBuffer);
                return
        }

    }

    return (
        <div className='export-container'>
            <Button
                onClick={exportIFC} tooltip-title="Экспорт IFC">
                IFC
                <img className={'icon-style'} src={MageBox} alt="MageBox"/>
            </Button>
            <Button onClick={exportFragments} tooltip-title="Экспорт Fragments">
                Frag
                <img className={'icon-style'} src={FluentPuzzle} alt="FluentPuzzle"/>
            </Button>
        </div>
    )

})

export default Export;
// return BUI.Component.create<BUI.PanelSection>(() => {
//     return BUI.html`
//             <bim-toolbar-section>
//                 <bim-button class="Bim-button-style" @click=${exportIFC} label="IFC" tooltip-title="Экспорт IFC">
//                     <img class="icon-style" src=${MageBox} alt="MageBox"/>
//                 </bim-button>
//                 <bim-button class="Bim-button-style" @click=${exportFragments} label="Frag" tooltip-title="Экспорт Fragments">
//                     <img class="icon-style" src=${FluentPuzzle} alt="FluentPuzzle"/>
//                 </bim-button>
//             </bim-toolbar-section>
//         `;
// });


// <bim-toolbar-section label="Экспорт" icon="solar:export-bold">
//     <bim-button @click=${exportIFC} label="IFC" icon="mage:box-3d-fill" tooltip-title="Экспорт IFC"></bim-button>
//     <bim-button @click=${exportFragments} label="Frag" icon="fluent:puzzle-cube-piece-20-filled" tooltip-title="Экспорт Fragments"></bim-button>
//     </bim-toolbar-section>