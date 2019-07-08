import { Specification } from '../specification/specification';
import { CustomComment } from '../customComment/custom-comment';
import { EnterpriseAccount } from '../enterprise/enterprise-account';

export class CostomSpecification extends Specification {
    public Enterprise: EnterpriseAccount;
    public Comments: CustomComment[];
    constructor() {
        super();
        this.Enterprise = new EnterpriseAccount();
        this.Comments = new Array();
    }
}
