import {useEffect, useRef} from 'react';
import * as BUI from "@thatopen/ui";
import {observer} from "mobx-react-lite";
import '../App.css'
import ToolBar from "./Toolbars/ToolBar";
import MenuBar from "./Panels/MenuBar";
import Minimap from "./Minimap";
import { useStore } from '../stores/StoreProvider';

const Scene = observer(()=>{

    const viewportContainer = useRef<HTMLDivElement>(null)
    const store = useStore();
    BUI.Manager.init();
    useEffect(() => {
        store.sceneStore.init(viewportContainer);
        store.sceneStore.fragTileInit();
    }, []);

  return (
      <>
          <div className={"leftpanel"}>
              <MenuBar/>
          </div>
          <div className={"viewport"} ref={viewportContainer}>
              <ToolBar/>
              <Minimap/>
          </div>
      </>
  )
})

export default Scene;
