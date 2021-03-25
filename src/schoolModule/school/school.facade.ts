import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { TeamMember } from '../teamMember/teamMember.entity';
import { SchoolAlreadyExistsException } from './exception/school-already-exists-exception';
import { SchoolReadDto } from './interface/school-read-dto';
import { SchoolWriteDto } from './interface/school-write-dto';
import { School } from './school.entity';
import { SchoolService } from './school.service';

@Injectable()
export class SchoolFacade {

    constructor(private schoolService: SchoolService, private userService: UserService) { }

    async createSchool(token: any, schoolDto: SchoolWriteDto): Promise<SchoolReadDto> {
        const user: User = await this.userService.getUserById(token.userId);
        const school: School = plainToClass(School, schoolDto);

        // Check if name already existe for this user
        if (await this.schoolService.getSchoolByName(school.name)) {
            throw new SchoolAlreadyExistsException();
        }

        // Create default team
        const member = new TeamMember();
        member.admin = true;
        member.user = user;
        school.teamMembers = [member];

        const schoolResp: School = await this.schoolService.saveSchool(school);
        return plainToClass(SchoolReadDto, schoolResp);
    }

    async getSchoolById(id: number): Promise<SchoolReadDto | undefined> {
        const school: School = await this.schoolService.getSchoolById(id);
        return plainToClass(SchoolReadDto, school);
    }
}
