import { AccountC } from '../account/account-c';
import { Center } from './center';

export class CenterAccount extends AccountC {
    center: Center;
    constructor() {
        super();
        this.center = new Center();
    }
}
