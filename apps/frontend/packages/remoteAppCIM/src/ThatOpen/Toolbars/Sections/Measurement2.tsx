import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as FRAGS from "@thatopen/fragments";
import Eraser from '../../../icons/material-symbols--ink-eraser-outline-rounded.svg'
import {Button, Checkbox, Flex} from "antd";
import {observer} from "mobx-react-lite";
import {useStore} from "../../../stores/StoreProvider";
import {useEffect, useState} from "react";
import {forEach} from "jszip";

type MeasureComponent =
    | OBF.EdgeMeasurement
    | OBF.FaceMeasurement
    | OBF.VolumeMeasurement
    | OBF.LengthMeasurement
    | OBF.AreaMeasurement;

const Measurement2 = observer(()=> {
    const store = useStore();
    const world = store.sceneStore.getWorld
    const components = store.sceneStore.getComponents;

    const Edge = components.get(OBF.EdgeMeasurement);
    const Face = components.get(OBF.FaceMeasurement);
    const Volume = components.get(OBF.VolumeMeasurement);
    const Length = components.get(OBF.LengthMeasurement);
    const Area = components.get(OBF.AreaMeasurement);

    const ToolNames = [
        {"Edge":'Ребро'},
        {"Face": "Плоскость"},
        {"Volume": "Объем"},
        {"Length": "Длина"},
        {"Area": "Площадь"}
    ]


    Edge.world = world;
    Face.world = world;
    Volume.world = world;
    Length.world = world;
    Area.world = world;

    const tools: { [key: string]: MeasureComponent } = {
        Edge,
        Face,
        Volume,
        Length,
        Area,
    };

    let selectedTool: keyof typeof tools | null = null;

    const setSelectedTool = (toolName: keyof typeof tools) => {
        console.log(toolName)
        if (selectedTool === toolName) {
            tools[toolName].enabled = false;
            selectedTool = null;
        } else {
            selectedTool = toolName;
            for (const key in tools) {
                tools[key].enabled = key === toolName;
            }
        }

        updateButtonStyles();
        // setupHighlighter();
        setupEvents();
        setupVolumeEvents();
    };

    const updateButtonStyles = () => {
        const buttons = document.querySelectorAll(".clipper-measurement-btn");
        buttons.forEach((button) => {
            const toolName = button.getAttribute("id");
            if (toolName === selectedTool) {
                (button as HTMLElement).style.backgroundColor = "#1677FF";
                (button as HTMLElement).style.color = "#FFFFFF"
            } else {
                (button as HTMLElement).style.backgroundColor = "";
                (button as HTMLElement).style.color = "#000000"
            }
        });
    };

    const createDimension = () => {
        if (!selectedTool) {
            return;
        }

        tools[selectedTool].create();
    };

    const deleteDimension = (event: KeyboardEvent) => {
        if (event.code === "Delete" && selectedTool) {
            tools[selectedTool].delete();
        }
    };

    const setupEvents = () => {
        window.removeEventListener("dblclick", createDimension);
        window.removeEventListener("keydown", deleteDimension);

        if (selectedTool && selectedTool !== "Volume") {
            window.addEventListener("dblclick", createDimension);
            window.addEventListener("keydown", deleteDimension);
        }
    };

    const setupVolumeEvents = () => {
        const highlighter = components.get(OBF.Highlighter);

        highlighter.events.select.onHighlight.remove(generateVolume);
        highlighter.events.select.onClear.remove(clearVolume);

        if (selectedTool === "Volume") {
            highlighter.events.select.onHighlight.add(generateVolume);
            highlighter.events.select.onClear.add(clearVolume);
        }
    };

    const generateVolume = (frags: FRAGS.FragmentIdMap) => {
        Volume.getVolumeFromFragments(frags);
    };

    const clearVolume = () => {
        Volume.clear();
    };

    const deleteAll = () => {
        for (const tool of Object.values(tools)) {
            tool.deleteAll();
            tool.enabled = false; //снимает выделение инструмента
        }
        clearVolume()
        selectedTool = null;
        setupEvents();
        //updateButtonStyles();
    };


    const [checkboxChecked, setCheckboxChecked] =
        useState([
        false,
        false,
        false,
        false,
        false,
    ])

    const editDisableButton = (index: number) => {
        deleteAll()
        setCheckboxChecked((prevState) => {
            const newState = [...prevState];
            for (let i = 0; i < newState.length; i++) if(newState[i] === true) newState[i] = false;
            newState[index] = true;
            return newState;
        })
    }

    return (
        <div>
            <Flex align="center" wrap gap="middle">
                {ToolNames.map((key, index,) => {
                    const toolName = Object.keys(key)[0];
                    const label = Object.values(key)[0];
                    return(
                        <Button id={toolName} className="clipper-measurement-btn" key={index} onClick={(e) => {
                            setSelectedTool(toolName);
                        }}>{label}</Button>
                    )
                })}

                <Button danger={true} onClick={deleteAll}>Стереть всё</Button>
            </Flex>

        </div>
    )
})

export default Measurement2;