import { Exclude, Expose } from "class-transformer";

@Exclude()
export class PlaceDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly name: string;
    @Expose()
    readonly altitude?: number;
}
