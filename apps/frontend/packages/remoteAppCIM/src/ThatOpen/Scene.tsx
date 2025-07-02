import {useEffect, useRef} from 'react';
import * as BUI from "@thatopen/ui";
import {observer} from "mobx-react-lite";
//import './App.css'
import ToolBar from "./Toolbars/ToolBar";
import MenuBar from "./Panels/MenuBar";
import Minimap from "./Minimap";
import { useStore } from '../stores/StoreProvider';


import * as OBF from "@thatopen/components-front";

const Scene = observer(()=>{

    const viewportContainer = useRef<HTMLDivElement>(null)
    const store = useStore().sceneStore;
    BUI.Manager.init();
    const isInit = store.getInit;
    useEffect(() => {
        
        store.init(viewportContainer);
        store.fragTileInit();
        store.setInit();

        return () => {
            store.dispose()
        }

    }, []);

  return (
        <div style={{
            height: '100%',
            position:'relative'
        }}>
          <div className={"leftpanel"}>
              <MenuBar/>
          </div>
          <div className={"viewport"} ref={viewportContainer}>
            <ToolBar/>
            {isInit === true? null : <Minimap/>}
          </div>
      </div>
  )
})

export default Scene;
