import {notifitaction} from "../UI/Notifications";
import {markerCast} from "../Toolbars/Marker";
import IssueForm from '../UI/IssueForm'
import { observer } from 'mobx-react-lite';
import {Button, Flex} from "antd";
import { useStore } from "../../stores/StoreProvider";
import { useEffect, useState } from "react";
import { uuid } from "../Toolbars/Sections/Import";

const Issue = observer(() => {
    const store = useStore();
    const components = store.sceneStore.getComponents;
    const world = store.sceneStore.getWorld;
    const {marker, caster} = markerCast(components,world);
    const [issueFormShow, setIssueFormShow] = useState(false)

    useEffect(()=>{
        store.dataStore.loadData()

    }, [store.dataStore.getIsChanged]);

    function onFormShow() {
        console.log(store.dataStore.getMarkersObjArray.map(item => (item.fileName)))
        if(world.meshes.size) {
            notifitaction(true);
            const vp = document.querySelector('.viewport');
            const item = Array.from(world.meshes);
            const handleClick = () => {
                const result = caster.castRay(item);
                //console.log(world.meshes.size)
                if(result?.object) {
                    console.log(result.point);
                    store.dataStore.setMarkerPoint(result.point);
                    store.dataStore.setMarkerKey(marker.create(world,
                        `<button class="issue-mark__button " style="pointer-events: all" id='issueMark'></button>`,
                        result.point)||null);
                }
                store.issueFormStore.openIssueForm();
                vp?.removeEventListener('click',handleClick)
            }
            vp?.addEventListener('click',handleClick)
            setIssueFormShow(true)
        }
        else {
            notifitaction(false);
        }

    }

    return (
        <div className="issue-tab">
            {issueFormShow == true ? 
            <IssueForm issueFormShow={issueFormShow} setIssueFormShow={setIssueFormShow}/>
            :
            <div id="list-div" className="issue-tab__list-div">
                <ul className="issue-tab__ul">
                    {
                    store.dataStore.data.map(item => {
                        if(item.uuid==uuid)
                            return (
                                <li className="issue-tab__li">
                                    <div 
                                    style={{
                                        width:'max-content',
        
                                        padding:'0 0.5rem', 
                                        backgroundColor: `${item.status == 'открыто' ? 'orange' : item.status == 'отвечено' ? 'blue' : 'grey'}`,
                                        borderRadius:'1rem',
                                        fontWeight:'600',
                                        fontSize:'0.7rem',
                                        color:'#fff',
                                        textTransform: 'uppercase'
                                    }}
                                    >
                                        {item.status}
                                    </div>
                                    <Flex align="center" gap={'1rem'}><h1>№{item.ID}</h1> <p>{item.title}</p></Flex>
                                    <Flex gap={'0.5rem'} vertical>
                                        <p>{item.assignedTo}</p>
                                        <p>{item.location}</p>
                                        <p>{item.description}</p>
                                        <p>{JSON.stringify(item.point)}</p>
                                    </Flex>
                                   
                                </li>
                            )})
                    }
                    
                </ul>
                <Button className="issue-tab__button" id="issueStartCreate"
                onClick={onFormShow}>
                    Создать Issue
                </Button>
            </div>}
        
    </div>
)
})
export default Issue;

