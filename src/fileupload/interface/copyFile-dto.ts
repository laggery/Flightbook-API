import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CopyFileDto {
    @Expose()
    readonly sourceFileName: string;
    @Expose()
    readonly destinationFileName: string;
}
