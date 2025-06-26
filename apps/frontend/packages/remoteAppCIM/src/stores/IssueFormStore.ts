import {makeAutoObservable} from "mobx";

export class IssueFormStore {
    private showIssueForm: boolean = false;

    get isIssueFormOpen() { 
        return this.showIssueForm;
    }

    openIssueForm = () => {
        this.showIssueForm = true;
    }
    closeIssueForm = () => {
        this.showIssueForm = false;
    }
    constructor() {
        makeAutoObservable(this);
    }

}
const issueFormStore = new IssueFormStore();
export default issueFormStore;