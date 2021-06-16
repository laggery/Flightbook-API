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
            where: {
                school: {
                    id: schoolId
                }
            }
        };
        return this.teamMemberRepository.find(options);
    }
}
