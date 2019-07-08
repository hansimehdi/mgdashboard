import { AccountC } from '../account/account-c';
import { Enterprise } from './enterprise';
export class EnterpriseAccount extends AccountC {
    enterprise: Enterprise;
    constructor() {
        super();
        this.enterprise = new Enterprise();
    }
}
