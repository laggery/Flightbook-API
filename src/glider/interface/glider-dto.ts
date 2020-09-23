import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GliderDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly buyDate?: string;
    @Expose()
    readonly brand: string;
    @Expose()
    readonly name: string;
    @Expose()
    readonly tandem: boolean;
    @Expose()
    readonly nbFlights: number;
    @Expose()
    readonly time: number;
}
