import { AccountC } from '../account/account-c';
import { User } from './user';
export class UserAccount extends AccountC {
    public user: User;
    constructor() {
        super();
        this.user = new User();
    }
}
