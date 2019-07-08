export class MailServer {
    public id: string;
    public host: string;
    public port: string;
    public email: string;
    public password: string;
    public type: string;
    constructor() {
        this.id = '';
        this.host = '';
        this.port = '';
        this.email = '';
        this.password = '';
        this.type = '';
    }
}
