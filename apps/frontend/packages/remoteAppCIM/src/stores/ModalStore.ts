import {makeAutoObservable} from "mobx";

export class ModalStore {
    private showModalForm: boolean = false;
    private showModalRow: boolean = false;
    private showModalDelete: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }
    closeModalForm = () => {
        this.showModalForm = false;
    }
    openModalForm = () => {
        this.showModalForm = true;
    }

    isModalFormOpen = () => this.showModalForm;

    closeModalRow = () => {
        this.showModalRow = false;
    }

    openModalRow = () => {
        this.showModalRow = true;
    }

    isModalRowOpen = () => this.showModalRow;


    closeModalDelete = () => {
        this.showModalDelete = false;
    }

    openModalDelete = () => {
        this.showModalDelete = true;
    }

    isModalRowDelete = () => this.showModalDelete;

}

const modalStore = new ModalStore();
export default modalStore;