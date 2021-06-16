import { Exclude, Expose } from "class-transformer";
import { SchoolDto } from "src/school-module/school/interface/school-dto";
import { UserReadDto } from "src/user/interface/user-read-dto";

@Exclude()
export class ValidationDto {
    @Expose()
    readonly id: number;
    @Expose()
    readonly state: ValidationState;
    @Expose()
    readonly date: Date | null;
    @Expose()
    readonly teacher: UserReadDto;
    @Expose()
    school!: SchoolDto;
}
