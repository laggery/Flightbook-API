import { Exclude, Expose } from "class-transformer";
import { SchoolReadDto } from "src/schoolModule/school/interface/school-read-dto";
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
    school!: SchoolReadDto;
}
