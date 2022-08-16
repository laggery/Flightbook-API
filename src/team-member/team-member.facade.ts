import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SchoolDto } from 'src/school/interface/school-dto';
import { UserReadDto } from 'src/user/interface/user-read-dto';
import { TeamMember } from './team-member.entity';
import { TeamMemberService } from './team-member.service';

@Injectable()
export class TeamMemberFacade {

    constructor(
        private teamMemberService: TeamMemberService) { }

    async getSchoolsByUserId(id: number): Promise<SchoolDto[]>  {
        const teamMembers = await this.teamMemberService.getTeamMembersByUserId(id);
        const schoolsDto: SchoolDto[] = [];
        
        teamMembers.forEach((teamMember: TeamMember) => {
            schoolsDto.push(plainToClass(SchoolDto, teamMember.school));
        });

        return schoolsDto;
    }

    async getUsersBySchoolId(id: number): Promise<UserReadDto[]>  {
        const teamMembers = await this.teamMemberService.getTeamMembersBySchoolId(id);
        const usersDto: UserReadDto[] = [];
        
        teamMembers.forEach((teamMember: TeamMember) => {
            usersDto.push(new UserReadDto(teamMember.user.email, teamMember.user.firstname, teamMember.user.lastname));
        });

        return usersDto;
    }
}
