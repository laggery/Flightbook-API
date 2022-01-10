import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from './team-member.entity';

@Injectable()
export class TeamMemberService {

    constructor(
        @InjectRepository(TeamMember)
        private readonly teamMemberRepository: Repository<TeamMember>
    ) { }

    async getTeamMembersBySchoolId(schoolId: number): Promise<TeamMember[]> {
        let options: any = {
            relations: ["user", "school"],
            where: {
                school: {
                    id: schoolId
                }
            }
        };
        return this.teamMemberRepository.find(options);
    }

    async getTeamMembersByUserId(id: number): Promise<TeamMember[]>  {
        let options: any = {
            relations: ["user", "school"],
            where: {
                user: id
            }
        };
        return this.teamMemberRepository.find(options);
    }
}
