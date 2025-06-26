
import {makeAutoObservable} from "mobx";
import {MarkerStore} from "./MarkerStore";
import {SceneStore} from "./SceneStore";
import {IssueFormStore} from "./IssueFormStore";
import { DataStore } from "./DataStore";
import { UsersStore } from "./UsersStore";
import { ModalStore } from "./ModalStore";
import {ThemeStore} from "./ThemeStore";

export class Store {
    markerStore: MarkerStore;
    sceneStore: SceneStore;
    issueFormStore: IssueFormStore;
    dataStore: DataStore;
    usersStore: UsersStore ;
    modalStore: ModalStore;
    themeStore: ThemeStore;
    constructor() {
        this.markerStore = new MarkerStore();
        this.sceneStore = new SceneStore();
        this.issueFormStore = new IssueFormStore();
        this.dataStore = new DataStore();
        this.usersStore = new UsersStore();
        this.modalStore = new ModalStore();
        this.themeStore = new ThemeStore();
        makeAutoObservable(this);
    }
}

const store = new Store();
export default store;