import {action, makeAutoObservable, observable} from "mobx";
import {IUserType} from "../types/types";

export class UsersStore {
    private loadedUsers: Array<IUserType> = [];

    constructor() {
        makeAutoObservable(this);
    }
    get users(): Array<IUserType> {
        return this.loadedUsers;
    }

    loadUsers = async () => {
        try {
            const users = localStorage.getItem('users');
            this.loadedUsers = users ? JSON.parse(users) : [];
        }
        catch (error) {
            console.log(error);
        }
    }


};

const usersStore = new UsersStore();
export default usersStore;