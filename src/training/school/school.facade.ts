import { Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { TeamMember } from '../team-member/team-member.entity';
import { SchoolDto } from './interface/school-dto';
import { School } from './school.entity';
import { SchoolService } from './school.service';
import {SchoolException} from "./exception/school.exception";

@Injectable()
export class SchoolFacade {

    constructor(
        private schoolService: SchoolService,
        private userService: UserService) { }

    async createSchool(token: any, schoolDto: SchoolDto): Promise<SchoolDto> {
        // Check name, address1, plz, city, phone, email
        if (!schoolDto.name || !schoolDto.address1 || !schoolDto.plz || !schoolDto.city || !schoolDto.phone || !schoolDto.email || !schoolDto.language) {
            throw SchoolException.invalidException();
        }

        const user: User = await this.userService.getUserById(token.userId);
        const school: School = plainToInstance(School, schoolDto);
        school.id = null;
        school.address2 = schoolDto.address2 === '' ? null : schoolDto.address2;

        // Check if name already existe for this user
        if (await this.schoolService.getSchoolByName(school.name)) {
            throw SchoolException.alreadyExistsException();
        }

        // Create default team
        const member = new TeamMember();
        member.admin = true;
        member.user = user;
        school.teamMembers = [member];

        const schoolResp: School = await this.schoolService.saveSchool(school);
        return plainToClass(SchoolDto, schoolResp);
    }

    async updateSchool(token: any, id: number, schoolDto: SchoolDto): Promise<SchoolDto> {
        // Check name, address1, plz, city, phone, email
        if (!schoolDto.name || !schoolDto.address1 || !schoolDto.plz || !schoolDto.city || !schoolDto.phone || !schoolDto.email) {
            throw SchoolException.invalidIdException();
        }

        // Check that user is admin from the school
        

        const school: School = await this.schoolService.getSchoolById(id);

        // Check if name already existe for this user
        if (school.name !== schoolDto.name && await this.schoolService.getSchoolByName(schoolDto.name)) {
            throw SchoolException.alreadyExistsException();
        }

        school.name = schoolDto.name;
        school.address1 = schoolDto.address1;
        school.address2 = schoolDto.address2;
        school.plz = schoolDto.plz;
        school.city = schoolDto.city;
        school.phone = schoolDto.phone;
        school.email = schoolDto.email;

        const schoolResp: School = await this.schoolService.saveSchool(school);
        return plainToClass(SchoolDto, schoolResp);
    }

    async getSchoolById(id: number): Promise<SchoolDto | undefined> {
        const school: School = await this.schoolService.getSchoolById(id);
        return plainToClass(SchoolDto, school);
    }
}
