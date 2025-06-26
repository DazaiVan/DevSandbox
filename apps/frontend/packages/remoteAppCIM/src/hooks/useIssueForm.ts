import { Form } from "antd";
import { useStore } from "../stores/StoreProvider"
import { useEffect } from "react";
import { markerCast } from "../ThatOpen/Toolbars/Marker";
import { observer } from "mobx-react-lite";
import { IssueDataType, IssueFormProps } from "../types/types";



export const useIssueForm = ({issueFormShow, setIssueFormShow}:IssueFormProps) => {
    const store = useStore();
    const [form] = Form.useForm();
    const components = store.sceneStore.getComponents;
    const world = store.sceneStore.getWorld;
    const {marker} = markerCast(components,world);
    useEffect(() => {
        if(issueFormShow){
            form.resetFields()
            //store.usersStore.loadUsers()
        }
    }, [issueFormShow]);

    function onCancel() {

        const form = document.getElementById('issueForm') as HTMLFormElement;
        if (form)
            form.reset();
  
        store.issueFormStore.closeIssueForm();
        console.log(JSON.stringify(store.dataStore.getMarkerKey))
        console.log(marker.getWorldMarkerList(store.sceneStore.getWorld))
        
        marker.delete(store.dataStore.getMarkerKey!);
        store.dataStore.deleteMarkerPoint();
        store.dataStore.deleteMarkerKey();
        setIssueFormShow(false);
    }
    const onFinish = (values:IssueDataType) => {
        store.dataStore.addNewData?.(values);
        store.issueFormStore.closeIssueForm();
        setIssueFormShow(false);
    };

    return { form, onCancel, onFinish };
}

