import { Vector3 } from "three";

export interface MarkerType {
    key: string | null; // ключ генерится методом create класса Маркер из thatopen, он должен быть строкой
    point: Vector3 | null;
}

export interface Markers {
    fileName: string,
    markers: Array<MarkerType>
}

export interface IUserType {
    id: number;
    name: string;
    email:string;
}
export interface IssueDataType {
    status: string,
    key:string | null,
    uuid: string,
    ID:number,
    title: string,
    description: string,
    assignedTo: string,
    location: string,
    dueDate: string,
    company: string,
    issueType: string,
    rootCause: string,
    document:string,
    creationDate:string,
    point:Vector3 | null
}

export interface IssueFormProps {
    issueFormShow: boolean;
    setIssueFormShow: (show: boolean) => void;
}