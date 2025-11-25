import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { SchoolDto } from '../../training/school/interface/school-dto';
import { UserReadIdDto } from '../../user/interface/user-read-id-dto';
import { TeamMemberException } from './exception/team-member.exception';
import { TeamMemberDto } from './interface/team-member-dto';
import { TeamMember } from './team-member.entity';
import { TeamMemberRepository } from './team-member.repository';

@Injectable()
export class TeamMemberFacade {

    constructor(
        private teamMemberRepository: TeamMemberRepository
    ) { }

    async getSchoolsByUserId(id: number): Promise<SchoolDto[]>  {
        const teamMembers = await this.teamMemberRepository.getTeamMembersByUserId(id);
        const schoolsDto: SchoolDto[] = [];
        
        teamMembers.forEach((teamMember: TeamMember) => {
            schoolsDto.push(plainToClass(SchoolDto, teamMember.school));
        });

        return schoolsDto;
    }

    async getTeamMembersBySchoolId(id: number): Promise<TeamMemberDto[]>  {
        const teamMembers = await this.teamMemberRepository.getTeamMembersBySchoolId(id);
        const teamMemberDtoList: TeamMemberDto[] = [];

        teamMembers.forEach((teamMember: TeamMember) => {
            const teamMemberDto = plainToClass(TeamMemberDto, teamMember);
            teamMemberDto.user = plainToClass(UserReadIdDto, teamMember.user);
            teamMemberDtoList.push(teamMemberDto);
        });

        return teamMemberDtoList;
    }

    async deleteTeamMember(id: number) : Promise<TeamMemberDto> {
        const teamMember = await this.teamMemberRepository.getTeamMemberById(id)
        if (!teamMember) {
            throw TeamMemberException.notFoundException();
        }

        if (teamMember.admin) {
            throw new UnauthorizedException();
        }

        this.teamMemberRepository.remove(teamMember)
        const teamMemberDto = plainToClass(TeamMemberDto, teamMember);
        teamMemberDto.user = plainToClass(UserReadIdDto, teamMember.user);

        return teamMemberDto;
    }

    async isUserTeamMemberFromSchool(schoolId: number, userId: number): Promise<boolean> {
        const teamMember = await this.teamMemberRepository.getTeamMembersByUserIdAndSchoolId(schoolId, userId);
        if (teamMember) {
            return true;
        } else {
            return false;
        }
    }
}
