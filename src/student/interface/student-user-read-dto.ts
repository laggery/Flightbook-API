import { Exclude, Expose } from "class-transformer";

@Exclude()
export class StudentUserReadDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly email: string;
    @Expose()
    readonly firstname: string;
    @Expose()
    readonly lastname: string;
}
