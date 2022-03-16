export class EmailBodyDto {
    public fromAddress: string;
    public toAddress: string;
    public subject: string;
    public content: string;
    public mailFormat: string;

    toString() {
        return `from: ${this.fromAddress}
        to: ${this.toAddress}
        subject: ${this.subject}
        content: ${this.content}`
    }
}