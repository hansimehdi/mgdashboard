import { Offer } from './offer';
import { AccountC } from './account/account-c';
import { Enterprise } from './enterprise/enterprise';
import { UserAccount } from './user/user-account';
import { CustomInterested } from './customInterested/custom-interested';

export class CustomOfferInfo extends Offer {
    public Account: AccountC;
    public Enterprise: Enterprise;
    public Interested: CustomInterested[];
    public insertiondate: string;
    constructor() {
        super();
        this.Account = new AccountC();
        this.Enterprise = new Enterprise();
        this.Interested = new Array();
        this.insertiondate = '';
    }
}
