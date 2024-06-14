export class EmailBodyDto {
    public fromAddress: string;
    public toAddress: string;
    public bccAddress: string;
    public subject: string;
    public content: string;
    public mailFormat: string;
    public replyTo: string;

    toString() {
        return `from: ${this.fromAddress}
        to: ${this.toAddress}
        bcc: ${this.bccAddress}
        subject: ${this.subject}
        content: ${this.content}
        replyTo: ${this.replyTo}`
    }
}