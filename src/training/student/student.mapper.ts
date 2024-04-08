import { plainToClass, plainToInstance } from "class-transformer";
import { Student } from "./student.entity";
import { StudentDto } from "./interface/student-dto";
import { UserReadIdDto } from "../../user/interface/user-read-id-dto";
import { FlightStatisticDto } from "../../flight/interface/flight-statistic-dto";

export class StudentMapper {

    public static toStudentDto(student: Student, stat: FlightStatisticDto): StudentDto {
        let studentDto = new StudentDto();
        studentDto.id = student.id;
        studentDto.user = plainToClass(UserReadIdDto, student.user);
        studentDto.statistic = stat;
        studentDto.isArchived = student.isArchived;
        return studentDto
    }
}
