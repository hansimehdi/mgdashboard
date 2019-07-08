import { Offer } from './offer';
import { Enterprise } from './enterprise/enterprise';
import { Interested } from './interested/interested';
import { AccountC } from './account/account-c';

export class CustomOffer extends Offer {
    public Enterprise: Enterprise;
    public Interested: Interested[];
    public Account: AccountC;
    constructor() {
        super();
        this.Enterprise = new Enterprise();
        this.Interested = new Array();
        this.Account = new AccountC();
    }
}
