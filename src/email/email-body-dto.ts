export class EmailBodyDto {
    public fromAddress: string;
    public toAddress: string;
    public subject: string;
    public content: string;
    public mailFormat: string;
}