import { Exclude, Expose } from "class-transformer";

@Exclude()
export class GuestSubscriptionDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
}
