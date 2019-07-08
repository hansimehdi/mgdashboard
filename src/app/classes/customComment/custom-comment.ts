import { Comment } from '../comment/comment';
import { CenterAccount } from '../center/center-account';
export class CustomComment extends Comment {
    public Center: CenterAccount;
    constructor() {
        super();
        this.Center = new CenterAccount();
    }
}
