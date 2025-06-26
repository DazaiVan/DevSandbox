import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as CUI from "@thatopen/ui-obc";
import * as WEBIFC from "web-ifc";
import {typeOfSourceModel} from "../Toolbars/Sections/Import";
import Search from "antd/es/input/Search";
import Expand from '../../icons/eva--expand-fill.svg'
import {Button, Checkbox, CheckboxProps, Dropdown, MenuProps} from "antd";
import {SearchProps} from "antd/es/input";
import {observer} from "mobx-react-lite";
import {useEffect, useRef, useState} from "react";
import { useStore } from "../../stores/StoreProvider";

const attributesOptions = [
    { value: 'Name', label: 'Name' },
    { value: 'ContainedInStructure', label: 'ContainedInStructure' },
    { value: 'ForLayerSet', label: 'ForLayerSet' },
    { value: 'LayerThickness', label: 'LayerThickness' },
    { value: 'HasProperties', label: 'HasProperties' },
    { value: 'HasAssociations', label: 'HasAssociations' },
    { value: 'HasAssignments', label: 'HasAssignments' },
    { value: 'HasPropertySets', label: 'HasPropertySets' },
    { value: 'PredefinedType', label: 'PredefinedType' },
    { value: 'Quantities', label: 'Quantities' },
    { value: 'ReferencedSource', label: 'ReferencedSource' },
    { value: 'Identification', label: 'Identification' },
    { value: 'Prefix', label: 'Prefix' },
    { value: 'LongName', label: 'LongName' },
];

const defaultSelected = ['Name', 'ContainedInStructure', 'HasProperties', 'HasPropertySets'];

const items: MenuProps['items'] = attributesOptions.map(option => ({
    key: option.value,
    label: option.label,
}))

const EntityAttributes = observer(() => {
    const store = useStore();
    const components = store.sceneStore.getComponents;
    const entityAttrRef = useRef<HTMLDivElement>(null)
    const fragments = components.get(OBC.FragmentsManager);
    const highlighter = components.get(OBF.Highlighter);
    // const appManager = components.get(AppManager);
    // const viewportGrid = appManager.grids.get("viewport");
    const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
        components,
        fragmentIdMap: {},
    });
    propsTable.preserveStructureOnFilter = true;
    fragments.onFragmentsDisposed.add(() => updatePropsTable());

    const search: SearchProps['onSearch'] = (e) => {
        propsTable.queryString = e.toString();
    };

    // const toggleExpanded = () => {
    //     propsTable.expanded = !propsTable.expanded;
    // };
    const baseStyle: Record<string, string> = {
        padding: "0.25rem",
        borderRadius: "0.25rem",
    };
    const tableDefinition: BUI.TableDataTransform = {
        Entity: (entity) => {
            let style = {};
            if (entity === OBC.IfcCategoryMap[WEBIFC.IFCPROPERTYSET]) {
                style = {
                    ...baseStyle,
                    backgroundColor: "purple",
                    color: "white",
                };
            }
            if (String(entity).includes("IFCWALL")) {
                style = {
                    ...baseStyle,
                    backgroundColor: "green",
                    color: "white",
                };
            }
            return BUI.html`<bim-label style=${BUI.styleMap(style)}>${entity}</bim-label>`;
        },
        PredefinedType: (type) => {
            const colors = ["#1c8d83", "#3c1c8d", "#386c19", "#837c24"];
            const randomIndex = Math.floor(Math.random() * colors.length);
            const backgroundColor = colors[randomIndex];
            const style = {...baseStyle, backgroundColor, color: "white"};
            return BUI.html`<bim-label style=${BUI.styleMap(style)}>${type}</bim-label>`;
        },
        NominalValue: (value) => {
            let style = {};
            if (typeof value === "boolean" && !value) {
                style = {...baseStyle, backgroundColor: "#b13535", color: "white"};
            }
            if (typeof value === "boolean" && value) {
                style = {...baseStyle, backgroundColor: "#18882c", color: "white"};
            }
            return BUI.html`<bim-label style=${BUI.styleMap(style)}>${value}</bim-label>`;
        },
    };
    const [attributesTable, updateAttributesTable] = CUI.tables.entityAttributes({
        components,
        fragmentIdMap: {},
        tableDefinition,
        attributesToInclude: () => {
            const attributes: any[] = [
                "Name",
                "ContainedInStructure",
                "HasProperties",
                "HasPropertySets",
                (name: string) => name.includes("Value"),
                (name: string) => name.startsWith("Material"),
                (name: string) => name.startsWith("Relating"),
                (name: string) => {
                    const ignore = ["IsGroupedBy", "IsDecomposedBy"];
                    return name.startsWith("Is") && !ignore.includes(name);
                },
            ];
            return attributes;
        },
    });

    attributesTable.expanded = true;
    attributesTable.indentationInText = true;
    attributesTable.preserveStructureOnFilter = true;
    highlighter.events.select.onHighlight.add((fragmentIdMap) => {
        if (typeOfSourceModel === ".frag") return
        // const entityButton = document.getElementById('EntityAttribute');
        // // @ts-ignore
        // entityButton.disabled = false;
        updateAttributesTable({fragmentIdMap});
    });

    highlighter.events.select.onClear.add(() => {
            // const entityButton = document.getElementById('EntityAttribute');
            // // @ts-ignore
            // entityButton.disabled = true;
            updateAttributesTable({fragmentIdMap: {}})
        }
    );
    useEffect(() => {
        if(entityAttrRef.current && attributesTable instanceof HTMLElement) {
            entityAttrRef.current.innerHTML = '';
            entityAttrRef.current.appendChild(attributesTable);
        }
    }, [attributesTable]);
// //нужно для того чтобы при клике в древе отношений таблица с атрибутами чистилась
//     document.addEventListener('DOMContentLoaded',()=>{
//         const relationsTree = document.getElementById('relations-tree')
//         if(relationsTree)
//         {   // @ts-ignore
//             relationsTree.addEventListener('click', () => {
//                 // const entityButton = document.getElementById('EntityAttribute');
//                 // // @ts-ignore
//                 // entityButton.disabled = true;
//                 updateAttributesTable({ fragmentIdMap: {} })//чистка таблицы
//                 console.log('success')
//             });
//         }
//     })
    const onPreserveStructureChange: CheckboxProps['onChange'] = (e) => {
        const checkbox = e.target;
        attributesTable.preserveStructureOnFilter = checkbox.checked;
    };
    const onAttributesChange = (e: string[]) => {
        updateAttributesTable({
            attributesToInclude: () => {
                return [
                    ...e,
                    (name: string) => name.includes("Value"),
                    (name: string) => name.startsWith("Material"),
                    (name: string) => name.startsWith("Relating"),
                    (name: string) => {
                        const ignore = ["IsGroupedBy", "IsDecomposedBy"];
                        return name.startsWith("Is") && !ignore.includes(name);
                    },
                ];
            },
        });
    };
    const onExportJSON = () => {
        attributesTable.downloadData("entities-attributes");
    };

    const onCopyTSV = async () => {
        await navigator.clipboard.writeText(attributesTable.tsv);
        alert(
            "Данные таблицы скопированы как TSV в буфер обмена! Попробуйте вставить их в приложение для работы с электронными таблицами.",
        );
    };
    return (
        <div className='entity-container' style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'space-between'}}>

                <div style={{display: "flex", gap: "0.375rem"}}>
                    <Search onSearch={search} placeholder="Поиск..."></Search>
                    <Button style={{flex: 0}} onClick={() => (onPreserveStructureChange)}>
                    <img height={"14px"} src={Expand} alt="World"/>
                    </Button>
                </div>


                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <Dropdown
                        menu={{
                            items,
                            selectable: true,
                            multiple: true,
                            defaultSelectedKeys: defaultSelected,
                            onSelect: ({ selectedKeys }) => onAttributesChange(selectedKeys),
                            onDeselect: ({ selectedKeys }) => onAttributesChange(selectedKeys)
                        }}
                        trigger={['hover']}
                    >
                        <Button>Атрибуты</Button>
                    </Dropdown>

                    <Button
                        onClick={onCopyTSV}
                        title="Копия TSV"
                    >
                        Копия TSV
                    </Button>

                    <Button
                        onClick={onExportJSON}
                        title="Экспорт JSON"
                    >
                        Экспорт JSON
                    </Button>
                </div>
            </div>
            <div className='entity-container__entity-table' ref={entityAttrRef} />
        </div>
        
    )
});
export default EntityAttributes;
  //   return BUI.Component.create(() => {
  //       const onSearchInput = (e: Event) => {
  //           const input = e.target as BUI.TextInput;
  //           attributesTable.queryString = input.value;
  //       };
  //
  //       const onPreserveStructureChange = (e: Event) => {
  //           const checkbox = e.target as BUI.Checkbox;
  //           attributesTable.preserveStructureOnFilter = checkbox.checked;
  //       };
  //
  //       const onExportJSON = () => {
  //           attributesTable.downloadData("entities-attributes");
  //       };
  //
  //       const onCopyTSV = async () => {
  //           await navigator.clipboard.writeText(attributesTable.tsv);
  //           alert(
  //               "Данные таблицы скопированы как TSV в буфер обмена! Попробуйте вставить их в приложение для работы с электронными таблицами.",
  //           );
  //       };
  //
  //       const onAttributesChange = (e: Event) => {
  //           const dropdown = e.target as BUI.Dropdown;
  //           updateAttributesTable({
  //               attributesToInclude: () => {
  //                   const attributes: any[] = [
  //                       ...dropdown.value,
  //                       (name: string) => name.includes("Value"),
  //                       (name: string) => name.startsWith("Material"),
  //                       (name: string) => name.startsWith("Relating"),
  //                       (name: string) => {
  //                           const ignore = ["IsGroupedBy", "IsDecomposedBy"];
  //                           return name.startsWith("Is") && !ignore.includes(name);
  //                       },
  //                   ];
  //                   return attributes;
  //               },
  //           });
  //       };
  //
  //       return BUI.html`
  //   <bim-panel>
  //     <bim-panel-section label="Атрибуты сущности" fixed>
  //       <div style="display: flex; gap: 0.5rem; justify-content: space-between;">
  //         <div style="display: flex; gap: 0.5rem;">
  //           <bim-text-input @input=${onSearchInput} type="search" placeholder="Поиск" debounce="250"></bim-text-input>
  //           <bim-checkbox @change=${onPreserveStructureChange} label="Сохранить структуру" inverted checked></bim-checkbox>
  //         </div>
  //         <div style="display: flex; gap: 0.5rem;">
  //           <bim-dropdown @change=${onAttributesChange} multiple>
  //             <bim-option value="Name" label="Name" checked></bim-option>
  //             <bim-option value="ContainedInStructure" label="ContainedInStructure" checked></bim-option>
  //             <bim-option value="ForLayerSet" label="ForLayerSet"></bim-option>
  //             <bim-option value="LayerThickness" label="LayerThickness"></bim-option>
  //             <bim-option value="HasProperties" label="HasProperties" checked></bim-option>
  //             <bim-option value="HasAssociations" label="HasAssociations"></bim-option>
  //             <bim-option value="HasAssignments" label="HasAssignments"></bim-option>
  //             <bim-option value="HasPropertySets" label="HasPropertySets" checked></bim-option>
  //             <bim-option value="PredefinedType" label="PredefinedType"></bim-option>
  //             <bim-option value="Quantities" label="Quantities"></bim-option>
  //             <bim-option value="ReferencedSource" label="ReferencedSource"></bim-option>
  //             <bim-option value="Identification" label="Identification"></bim-option>
  //             <bim-option value="Prefix" label="Prefix"></bim-option>
  //             <bim-option value="LongName" label="LongName"></bim-option>
  //           </bim-dropdown>
  //           <bim-button @click=${onCopyTSV} icon="solar:copy-bold" tooltip-title="Копия TSV" tooltip-text="Скопирует содержимое таблицы в виде текстовых значений, разделенных табуляцией, чтобы их можно было скопировать в электронную таблицу."></bim-button>
  //           <bim-button @click=${onExportJSON} icon="ph:export-fill" tooltip-title="Эскпорт JSON" tooltip-text="Загружает содержимое таблицы в виде файла JSON."></bim-button>
  //         </div>
  //       </div>
  //       ${attributesTable}
  //     </bim-panel-section>
  //   </bim-panel>
  // `;