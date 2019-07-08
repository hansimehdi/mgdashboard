import { Interested } from '../interested/interested';
import { UserAccount } from '../user/user-account';

export class CustomInterested extends Interested {
    public user: UserAccount;
    constructor() {
        super();
        this.user = new UserAccount();
    }
}
