import { plainToInstance } from "class-transformer";
import { UserReadDto } from 'src/user/interface/user-read-dto';
import { AppointmentType } from "./appointment-type.entity";
import { AppointmentTypeDto } from "./interface/appointment-type-dto";

export class AppointmentTypeMapper {

    public static toAppointmentTypeDtoList(types: AppointmentType[]): AppointmentTypeDto[] {
        const typeDtoList = [];
        types.forEach((type: AppointmentType) => {
            typeDtoList.push(this.toAppointmentTypeDto(type));
        })
        return typeDtoList
    }

    public static toAppointmentTypeDto(type: AppointmentType): AppointmentTypeDto {
        const {instructor} = type;
        const typeDto= plainToInstance(AppointmentTypeDto, type)

        if(instructor) {
            typeDto.instructor = new UserReadDto(instructor.email, instructor.firstname, instructor.lastname);
        }

        return typeDto
    }
}
