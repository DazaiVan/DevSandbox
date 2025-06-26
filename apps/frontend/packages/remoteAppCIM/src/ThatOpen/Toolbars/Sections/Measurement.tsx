import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as FRAGS from "@thatopen/fragments";
import Eraser from '../../../icons/material-symbols--ink-eraser-outline-rounded.svg'

type MeasureComponent =
    | OBF.EdgeMeasurement
    | OBF.FaceMeasurement
    | OBF.VolumeMeasurement
    | OBF.LengthMeasurement
    | OBF.AreaMeasurement;

export default (world: OBC.World, components: OBC.Components) => {
  const Edge = components.get(OBF.EdgeMeasurement);
  const Face = components.get(OBF.FaceMeasurement);
  const Volume = components.get(OBF.VolumeMeasurement);
  const Length = components.get(OBF.LengthMeasurement);
  const Area = components.get(OBF.AreaMeasurement);

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
    const buttons = document.querySelectorAll(".tool-button");
    buttons.forEach((button) => {
      const toolName = button.getAttribute("data-tool");
      if (toolName === selectedTool) {
        (button as HTMLElement).style.backgroundColor = "#d3d3d3"
      } else {
        (button as HTMLElement).style.backgroundColor = ""
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

  // const setupHighlighter = () => {
  //   const highlighter = components.get(OBF.Highlighter);
  //   // highlighter.enabled = selectedTool !== "Volume";
  // };

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
    updateButtonStyles();
  };

  const createToolButton = (label: string, toolName: keyof typeof tools) => {
    return BUI.Component.create<BUI.Button>(() => {
      return BUI.html`
        <bim-button
          class="tool-button"
          data-tool="${toolName}"
          label="${label}"
          @click="${() => setSelectedTool(toolName)}"
        ></bim-button>
      `;
    });
  };

  return BUI.Component.create<BUI.PanelSection>(() => {
    return BUI.html`
      <bim-toolbar-section label="Измерение" style="pointer-events: auto">
        ${createToolButton("Ребро", "Edge")}
        ${createToolButton("Плоскость", "Face")}
        ${createToolButton("Объём", "Volume")}
        ${createToolButton("Длина", "Length")}
        ${createToolButton("Площадь", "Area")}
        <bim-button class="Bim-button-style" @click="${deleteAll}" label="Стереть" >
            <img class="icon-style" src=${Eraser} alt="Eraser"/>
        </bim-button>
      </bim-toolbar-section>
    `;
  });
};

// <bim-toolbar-section label="Измерение" icon="tdesign:measurement-1" style="pointer-events: auto">
//     ${createToolButton("Ребро", "Edge")}
//     ${createToolButton("Плоскость", "Face")}
//     ${createToolButton("Объём", "Volume")}
//     ${createToolButton("Длина", "Length")}
//     ${createToolButton("Площадь", "Area")}
//     <bim-button @click="${deleteAll}" label="Стереть" icon="material-symbols:fit-screen-rounded"></bim-button>
//     </bim-toolbar-section>