import {makeAutoObservable} from 'mobx';
import {IssueDataType, MarkerType, Markers} from "../types/types";
import {FormProps} from "antd";
import DataService from "../services/dataService";
import modalStore, {ModalStore} from "./ModalStore";
import issueFormStore, {IssueFormStore} from "./IssueFormStore"
import dayjs from "dayjs";
import { Vector3 } from 'three';
import { model, uuid } from '../ThatOpen/Toolbars/Sections/Import';
import { IfcProperties } from '@thatopen/fragments';

export class DataStore {
    private modalStore: ModalStore;
    private issueFormStore: IssueFormStore;
    private loadedData: Array<IssueDataType> = [];
    private markersObjArray: Array<Markers> = [];
    private markerItem: MarkerType = {
        key:null,
        point:null
    };
    private selectedItemID: number = 0;
    private isChanged: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this.modalStore = modalStore;
        this.issueFormStore = issueFormStore;
    }
    get getMarker():Readonly<MarkerType> {
        return this.markerItem;
    }
    get getIsChanged():boolean{
        return this.isChanged;
    }
    get getMarkersObjFileName():string{
        return  this.markersObjArray[0].fileName
    }
    setMarkersObjFileName (value:string) {
        this.markersObjArray.push({fileName:value, markers:[]})
    }
    setIsChanged(value:boolean){
        this.isChanged=value;
    }
    setMarkerKey(value:string|null){
        this.markerItem.key = value;
    }
    get getMarkerKey ():Readonly<string | null> {
        return this.markerItem.key
    }
    setMarkerPoint(value:Vector3){
        this.markerItem.point = value;
    }
    get data(): Readonly<Array<IssueDataType>> {
        return this.loadedData;
    }
    get getMarkersObjArray(): Readonly<Markers[]> {
        return this.markersObjArray;
    }
    get selectedItemNum() { return this.selectedItemID }
    setSelectedItem(num:number) {
        this.selectedItemID = num;
    }

    deleteRow = async () => {
        let arrIndex = this.loadedData.findIndex(item => item.ID === this.selectedItemID);
        if (arrIndex !== -1) {
            this.loadedData.splice(arrIndex, 1);
            try {
                await DataService.setData(this.loadedData);
                this.setIsChanged(!this.isChanged);
                this.isChanged = !this.isChanged;
                this.modalStore.closeModalDelete();
                this.modalStore.closeModalRow();
            } catch (error) {
                console.log(error);
            }
        }

    }

    deleteMarkerPoint = () => {
        this.markerItem.point = null;
    }
    deleteMarkerKey =   () => {
        this.markerItem.key = null;
    }

    loadData = async () => {
        try {
            const data = await this.fetchDataFromService();
            this.setData(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    private fetchDataFromService = async () => {
        const data = await DataService.getData();
        return data ? JSON.parse(data) : [];
    }

    setData = (data: IssueDataType[]) => {
        this.loadedData = data;
    }



    addNewData:FormProps['onFinish'] = async (values) => {
        const items = this.loadedData;
        let today = new Date().toLocaleDateString();
        const newItem: IssueDataType = {
            status: values.status,
            uuid: uuid,
            key: this.markerItem.key,
            ID: items.length > 0 ? items[items.length - 1].ID + 1 : 0,
            title: values.title,
            location: values.location || '-',
            assignedTo: values.assignedTo || '-',
            company: values.company || '-',
            issueType: values.issueType || '-',
            rootCause: values.rootCause || '-',
            dueDate: values["dueDate"] ? values["dueDate"].format('DD.MM.YYYY') : '-',
            document: "-",
            description: values.description || '-',
            creationDate: today,
            point:this.markerItem.point
        };
        this.loadedData.push(newItem);
        try {
            await DataService.setData(items).then(r => {this.modalStore.closeModalForm();});
            this.markersObjArray.map(item => {
                try
                {   
                    item.markers.push({key:this.markerItem.key,point: this.markerItem.point});
                    console.log(item.fileName,'-item.fileName')
                }
                catch {
                    console.log(item.fileName,'-item.fileName')
                }
            })
            // console.log(this.markersObjArray,'-markersObjArray')
            // const restProperties = model.getLocalProperties();
            // const properties: IfcProperties = {
            //     ...restProperties,
            //     [this.markerKey.key + "0000"]: {
            //         key: this.markerKey.key,
            //         point: this.markerKey.point
            //     },}
            // model.setLocalProperties(properties)
            this.setIsChanged(!this.isChanged);
        } catch (error) {
            console.log(error);
        }
    }


    getIssueItem = () => {
        return this.loadedData.find((item: IssueDataType) => item.ID === this.selectedItemID)
    }


    changeIssueItem = async (value:any, field:string) => {
        const issue = this.getIssueItem();
        switch (field){
            case 'status':
                if(issue) {
                    issue.status = value;
                    try {
                        await DataService.setData(this.loadedData);
                        this.setIsChanged(!this.isChanged);
                    } catch (error) {
                        console.log(error);
                    }

                }
                break;
            case 'assignedTo':
                if(issue) {
                    issue.assignedTo = value;
                    try {
                        await DataService.setData(this.loadedData);
                        this.setIsChanged(!this.isChanged);
                    } catch (error) {
                        console.log(error);
                    }

                }
                break;
            case 'dueDate':
                if (issue && value!=null) {
                    issue.dueDate = dayjs(value).format('DD.MM.YYYY').toString();
                    await DataService.setData(this.loadedData);
                    this.setIsChanged(!this.isChanged);
                }
                break;
            case 'location':
                if(issue) {
                    issue.location = value.target.value;
                    await DataService.setData(this.loadedData);
                    this.setIsChanged(!this.isChanged);
                }
                break;
        }
    }
}
