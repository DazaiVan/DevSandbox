import {useEffect, useRef} from 'react';
import {observer} from "mobx-react-lite";
import { useStore } from '../stores/StoreProvider';

const Minimap = observer(() => {
    const store = useStore();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(!store.sceneStore.getIsWorldReady) return;
        store.sceneStore.minimapInit(mapContainerRef);
    }, [store.sceneStore.getIsWorldReady]);

    return (
        <div style={{position: "absolute",right: "1em",top: "1em"}}>
            <div ref={mapContainerRef}/>
        </div>
    );
});

export default Minimap;