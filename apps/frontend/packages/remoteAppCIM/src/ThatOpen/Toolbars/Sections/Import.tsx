/* eslint-disable no-alert */
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as FRAGS from "@thatopen/fragments";
import {FragmentsGroup} from "@thatopen/fragments";
import MageBox from '../../../icons/mage--box-3d-fill.svg'
import FluentPuzzle from '../../../icons/fluent--puzzle-cube-piece-20-filled.svg'
import {observer} from "mobx-react-lite";
import {Button, Image} from "antd";
import { useStore } from "../../../stores/StoreProvider";

export let uuid = '';
export let buffer : Uint8Array;
export let model: FragmentsGroup;
export let typeOfSourceModel: string;

const askForFile = (extension: string) => {
  const input = document.createElement("input");
  return new Promise<File | null>((resolve) => {
    input.type = "file";
    input.accept = extension;
    input.multiple = false;
    input.onchange = (e) => {
      const filesList = input.files;
      if (!(filesList && filesList[0])) {
        resolve(null);
        return;
      }
      const file = filesList[0];
      resolve(file);
    };
    input.click();
  });
};

const Load = observer(() => {
  const store = useStore();
  const components = store.sceneStore.getComponents;
  const world = store.sceneStore.getWorld;
  const ifcLoader = components.get(OBC.IfcLoader);
  const fragmentsManager = components.get(OBC.FragmentsManager);

  const commonLoadBlock = async (file: File, type: string) => {
    const data = await file.arrayBuffer();
    buffer = new Uint8Array(data);
    switch (type) {
      case '.ifc':
        model = await ifcLoader.load(buffer);
        model.name = file.name;
        uuid = model.uuid;
        typeOfSourceModel = type;
        //const fragments = components.get(OBC.FragmentsManager);
        //const data = fragments.export(model);
        //download(new File([new Blob([data])], file.name?.replace(/\.ifc$/, "") + ".frag"));
        //const properties = model.getLocalProperties();

        return;
      case '.frag':
        model = fragmentsManager.load(buffer);
        uuid = model.uuid;
        typeOfSourceModel = type;
        // loadInfo()
        return;
      case '.json':
        const propsData = JSON.parse(new TextDecoder().decode(buffer));
        model.setLocalProperties(propsData);
    }

  }
  function download(file: File) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  const loadIFC = async () => {
    const file = await askForFile(".ifc");
    if (!file) return;
    // await ifcLoader.setup();
    ifcLoader.settings.wasm = {
      path: "http://localhost:5001/web-ifc/",
      absolute: true,
    };

    try {
      await commonLoadBlock(file, '.ifc');
      store.dataStore.setMarkersObjFileName(model.uuid);  // Загрузка имени файла в массив для инициализации стора маркеров
      console.log(store.dataStore.getMarkersObjFileName);
    }
    catch (err) {
      console.log(err)
      await commonLoadBlock(file, '.frag');
    }
  }

  const loadFragments = async () => {
    if (fragmentsManager.groups.size) return
    const file = await askForFile(".frag");
    if (!file) return;

    await commonLoadBlock(file, '.frag');
  };
  const loadInfo = async () => {
   
    const file = await askForFile(".json");
    if (!file) return;

    await commonLoadBlock(file, '.json');
  };

  const streamer = components.get(OBF.IfcStreamer) as OBF.IfcStreamer;

  // We are opening local files, so no cache use needed
  streamer.useCache = false;

  const streamedDirectories: { [name: string]: any } = {};

  const getStreamDirName = (name: string) => {
    return name.substring(0, name.indexOf(".ifc"));
  };

  streamer.fetch = async (path: string) => {
    const name = path.substring(path.lastIndexOf("/") + 1);
    const modelName = getStreamDirName(name);
    const directory = streamedDirectories[modelName];
    const fileHandle = await directory.getFileHandle(name);
    return fileHandle.getFile();
  };

  FRAGS.FragmentsGroup.fetch = async (name: string) => {
    const modelName = getStreamDirName(name);
    const directory = streamedDirectories[modelName];
    const fileHandle = await directory.getFileHandle(name);
    return fileHandle.getFile();
  };

  async function loadTiles() {
    let currentDirectory: any | null = null;
    const directoryInitialized = false;

    try {
      // @ts-ignore
      currentDirectory = await window.showDirectoryPicker();
    } catch (e) {
      return;
    }

    const geometryFilePattern = /-processed.json$/;
    const propertiesFilePattern = /-processed-properties.json$/;

    let geometryData: any | undefined;
    let propertiesData: any | undefined;

    for await (const entry of currentDirectory.values()) {
      if (!directoryInitialized) {
        const name = getStreamDirName(entry.name);
        streamedDirectories[name] = currentDirectory;
      }

      if (geometryFilePattern.test(entry.name)) {
        const file = (await entry.getFile()) as File;
        geometryData = await JSON.parse(await file.text());
        continue;
      }

      if (propertiesFilePattern.test(entry.name)) {
        const file = (await entry.getFile()) as File;
        propertiesData = await JSON.parse(await file.text());
      }
    }

    if (geometryData) {
      await streamer.load(geometryData, false, propertiesData);
    }
  }


  // const loadTest = async () => {
  //   const fragments = components.get(OBC.FragmentsManager);
  //   const file = await fetch(
  //     "/frag/small.frag",
  //   );
  //   const data = await file.arrayBuffer();
  //   const buffer = new Uint8Array(data);
  //   const model = fragments.load(buffer);
  //   world.scene.three.add(model);
    
  //   const propsFile = await fetch(
  //     "/frag/small.json",
  //   );
  //   const propsData = await propsFile.json();
  //   model.setLocalProperties(propsData);

  //   const indexer = components.get(OBC.IfcRelationsIndexer);
  //   await indexer.process(model);
  // };

  const loadFragAndInfo = async () => {
    const fragments = components.get(OBC.FragmentsManager);
    
    // Выбор .frag файла
    const fragInput = document.createElement("input");
    fragInput.type = "file";
    fragInput.accept = ".frag";
    fragInput.click();
    
    fragInput.onchange = async (event) => {
      const inputElement = event.target;
      if (!(inputElement instanceof HTMLInputElement) || !inputElement.files || inputElement.files.length === 0) return;
      const file = inputElement.files[0];
      const data = await file.arrayBuffer();
      buffer = new Uint8Array(data);
      model = fragments.load(buffer);
      uuid = model.uuid;
      world.scene.three.add(model);
      
      // Выбор .json файла
      const jsonInput = document.createElement("input");
      jsonInput.type = "file";
      jsonInput.accept = ".json";
      jsonInput.click();
      
      jsonInput.onchange = async (event) => {
        const jsonElement = event.target;
        if (!(jsonElement instanceof HTMLInputElement) || !jsonElement.files || jsonElement.files.length === 0) return;
        const propsFile = jsonElement.files[0];
        const propsData = JSON.parse(await propsFile.text());
        model.setLocalProperties(propsData);
        
        const indexer = components.get(OBC.IfcRelationsIndexer);
        await indexer.process(model);
      };
    };
  };
  // return BUI.Component.create<BUI.PanelSection>(() => {
  //   return BUI.html`
  //
  //     <bim-toolbar-section>
  //       <bim-button class="Bim-button-style" @click=${loadIFC} label="IFC" tooltip-title="Загрузка IFC"
  //         tooltip-text="Загружает предварительно преобразованный IFC из файла Fragments. Используйте эту опцию, если хотите избежать преобразования из IFC в Fragments.">
  //           <img class="icon-style" src=${MageBox} alt="MageBox"/>
  //       </bim-button>
  //       <bim-button class="Bim-button-style" @click=${loadFragAndInfo} label="Frag" tooltip-title="Загрузка Fragments"
  //         tooltip-text="">
  //           <img class="icon-style" src=${FluentPuzzle} alt="FluentPuzzle"/>
  //       </bim-button>
  //     </bim-toolbar-section>
  //   `;
  // });

  return (
      <div className='import-container'>
        <Button onClick={loadIFC}>
          IFC
          <img className={'icon-style'} src={MageBox} alt="MageBox"/>
        </Button>
        <Button onClick={loadFragAndInfo}>
          Frag
          <img className={'icon-style'} src={FluentPuzzle} alt="FluentPuzzle"/>
        </Button>
      </div>
  )

})

export default Load;


// <bim-toolbar-section label="Импорт" icon="solar:import-bold">
//     <bim-button @click=${loadIFC} label="IFC" icon="mage:box-3d-fill" tooltip-title="Загрузка IFC"
// tooltip-text="Загружает предварительно преобразованный IFC из файла Fragments. Используйте эту опцию, если хотите избежать преобразования из IFC в Fragments."></bim-button>
//     <bim-button @click=${loadFragments} label="Frag" icon="fluent:puzzle-cube-piece-20-filled" tooltip-title="Загрузка Fragments"
// tooltip-text=""></bim-button>
//     </bim-toolbar-section>