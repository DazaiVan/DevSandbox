import {IssueDataType} from "../types/types";

const DataService = {
    getData: async () => {
        try {
            return localStorage.getItem('data');
        }
        catch (error) {
            console.log(error);
            throw error;
        }

    },
    // getMarkerData: async () => {
    //     try {
    //         return localStorage.getItem('marker-data');
    //     }
    //     catch (error) {
    //         console.log(error);
    //         throw error;
    //     }

    // },
    setData: async (items: IssueDataType[]) => {
        try {
            localStorage.setItem('data', JSON.stringify(items));
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    },
    // setMarkerData: async (items: IssueDataType[]) => {
    //     try {
    //         localStorage.setItem('data', JSON.stringify(items));
    //     }
    //     catch (error) {
    //         console.log(error);
    //         throw error;
    //     }
    // }
};

export default DataService;