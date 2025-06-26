import {makeAutoObservable} from 'mobx';

export class MarkerStore {
    private markerKey: string[] = [];
    get getMarkerKey() {
        return this.markerKey
    }
    constructor() {
        makeAutoObservable(this);
    }


}
