import { Profilepicture } from '../profilepicture/profilepicture';
export interface Accountwithpp {
    id: string;
    username: string;
    firstname: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    insertionDate: string;
    blockStatus: string;
    connectionDT: string;
    currentLogin: string;
    blockExpire: string;
    expire: string;
    token: string;
    profilepicture: Profilepicture;
}
