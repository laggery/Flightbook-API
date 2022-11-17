import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SchoolDto } from 'src/training/school/interface/school-dto';
import { UserReadIdDto } from 'src/user/interface/user-read-id-dto';
import { TeamMemberException } from './exception/team-member.exception';
import { TeamMemberDto } from './interface/team-member-dto';
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

    async getTeamMembersBySchoolId(id: number): Promise<TeamMemberDto[]>  {
        const teamMembers = await this.teamMemberService.getTeamMembersBySchoolId(id);
        const teamMemberDtoList: TeamMemberDto[] = [];

        teamMembers.forEach((teamMember: TeamMember) => {
            const teamMemberDto = plainToClass(TeamMemberDto, teamMember);
            teamMemberDto.user = plainToClass(UserReadIdDto, teamMember.user);
            teamMemberDtoList.push(teamMemberDto);
        });

        return teamMemberDtoList;
    }

    async deleteTeamMember(id: number) : Promise<TeamMemberDto> {
        const teamMember = await this.teamMemberService.getTeamMemberById(id)
        if (!teamMember) {
            throw TeamMemberException.notFoundException();
        }

        if (teamMember.admin) {
            throw new UnauthorizedException();
        }

        this.teamMemberService.removeTeamMember(teamMember)
        const teamMemberDto = plainToClass(TeamMemberDto, teamMember);
        teamMemberDto.user = plainToClass(UserReadIdDto, teamMember.user);

        return teamMemberDto;
    }
}
