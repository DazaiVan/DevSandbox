import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import customSelections from "../../Tables/CustomSelections";
import Check from '../../../icons/mingcute--check-fill.svg'
import Close from '../../../icons/mingcute--close-fill.svg'
import Blocks from '../../../icons/clarity--blocks-group-solid.svg'
import {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {Button, Input, InputRef} from "antd";
import { useStore } from "../../../stores/StoreProvider";
const Groupings = observer(() => {
    const store = useStore();
    const components = store.sceneStore.getComponents;
    const [customSelectionsTable, updateCustomSelections] = customSelections({
        components,
    });
    const highlighter = components.get(OBF.Highlighter);

    const [customSelTable,setCustomSelTable] = useState<HTMLDivElement|null>(null);
    const [newSelectionForm, setNewSelectionForm] = useState<HTMLDivElement | null>(null);
    const groupNameInput = useRef<InputRef>(null);
    const saveSelectionBtn = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (!highlighter?.events?.select) return;

          const handleClear = () => {
              if (newSelectionForm) newSelectionForm.style.display = 'none';
              if (groupNameInput.current?.input) groupNameInput.current.input.value = "";
              if (saveSelectionBtn.current) saveSelectionBtn.current.style.display = 'none';
          };

          const handleHighlight = () => {
              if (saveSelectionBtn.current) saveSelectionBtn.current.style.display = 'block';
          };

          highlighter.events.select.onClear.add(handleClear);
          highlighter.events.select.onHighlight.add(handleHighlight);

          return () => {
              highlighter.events.select.onClear.remove(handleClear);
              highlighter.events.select.onHighlight.remove(handleHighlight);
          };
          }, [highlighter, customSelectionsTable]);

    const onSaveGroupSelection = async () => {
        if (!groupNameInput.current?.input || !newSelectionForm || !saveSelectionBtn.current) return;

        const groupName = groupNameInput.current.input.value;
        if (groupName.trim() === "") return;

        newSelectionForm.style.display = "none";
        saveSelectionBtn.current.style.display = "none";

        const classifier = components.get(OBC.Classifier);
        const customSelections = classifier.list.CustomSelections;
        customSelections[groupName] = {
            name: groupName,
            map: highlighter.selection.select,
            id: null,
        };

        updateCustomSelections();
        groupNameInput.current.input.value = "";
    };

    const onNewSelection = () => {
        if (!newSelectionForm) return;
        const selectionLength = Object.keys(highlighter.selection.select).length;
        if (selectionLength === 0) return;
        newSelectionForm.style.display = "flex";
    };

    const onCancelGroupCreation = () => {
        if (!newSelectionForm || !groupNameInput.current?.input) return;
        newSelectionForm.style.display = "none";
        groupNameInput.current.input.value = "";
    };

    useEffect(() => {
        if(customSelTable && customSelectionsTable instanceof HTMLElement) {
            customSelTable.innerHTML = '';
            customSelTable.appendChild(customSelectionsTable);
        }
    }, [customSelTable,customSelectionsTable]);

    return (
      <div className='grouping-container'>
        <div className="TitleWithIcon">
          <img style={{height: "14px"}} src={Blocks} alt="Blocks"/>
          <p style={{marginLeft: "0.2rem"}}>Сохранённые структуры</p>
        </div>
        <div ref={setNewSelectionForm} style={{ display: "none", gap: "0.5rem" }}>
            <Input
                ref={groupNameInput}
                type='text'
                placeholder="Selection Name..."
            />
            <Button
                className="Bim-button-style"
                onClick={onSaveGroupSelection}
                style={{ flex: 0 }}
            >
                <img className="icon-style" src={Check} alt="Check"/>
            </Button>
            <Button
                className="Bim-button-style"
                onClick={onCancelGroupCreation}
                style={{ flex: 0 }}
            >
                <img className="icon-style" src={Close} alt="Close"/>
            </Button>
        </div>
        <div ref={setCustomSelTable}/>
        <Button
            ref={saveSelectionBtn}
            style={{ display: 'none' }}
            onClick={onNewSelection}
        >
          Добавить структуру
        </Button>
      </div>

  )

});

export default Groupings;
// return BUI.Component.create<BUI.PanelSection>(() => {
//   return BUI.html`
//       <bim-panel-section >
//         <div class="TitleWithIcon">
//             <img style="height: 14px" src=${Blocks} alt="Blocks"/>
//             <p style="margin-left: 0.2rem">Сохранённые структуры</p>
//         </div>
//         <div ${BUI.ref(onFormCreated)} style="display: none; gap: 0.5rem">
//           <bim-text-input ${BUI.ref(onGroupNameInputCreated)} placeholder="Selection Name..." vertical></bim-text-input>
//           <bim-button class="Bim-button-style" @click=${onSaveGroupSelection} style="flex: 0" label="Сохранить">
//             <img class="icon-style" src=${Check} alt="Check"/>
//           </bim-button>
//           <bim-button class="Bim-button-style" @click=${onCancelGroupCreation} style="flex: 0" label="Отменить">
//             <img class="icon-style" src=${Close} alt="Close"/>
//           </bim-button>
//         </div>
//         ${customSelectionsTable}
//         <bim-button style="display: none;" ${BUI.ref(onSaveSelectionCreated)} @click=${onNewSelection} label="Добавить структуру"></bim-button>
//       </bim-panel-section>
//     `;
// });


// <bim-panel-section label="Сохранённые структуры" icon="clarity:blocks-group-solid">
// <div ${BUI.ref(onFormCreated)} style="display: none; gap: 0.5rem">
//     <bim-text-input ${BUI.ref(onGroupNameInputCreated)} placeholder="Selection Name..." vertical></bim-text-input>
// <bim-button @click=${onSaveGroupSelection} icon="mingcute:check-fill" style="flex: 0" label="Сохранить"></bim-button>
//     <bim-button @click=${onCancelGroupCreation} icon="mingcute:close-fill" style="flex: 0" label="Отменить"></bim-button>
//     </div>
//     ${customSelectionsTable}
//     <bim-button style="display: none;" ${BUI.ref(onSaveSelectionCreated)} @click=${onNewSelection} label="Добавить структуру"></bim-button>
//     </bim-panel-section>