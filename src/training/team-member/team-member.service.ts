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
            relations: {
                user: true,
                school: true
            },
            where: {
                school: {
                    id: schoolId
                }
            }
        };
        return this.teamMemberRepository.find(options);
    }

    async getTeamMemberById(id: number): Promise<TeamMember>  {
        if (!id) {
            return undefined;
        }
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                id: id
            }
        };
        return this.teamMemberRepository.findOne(options);
    }

    async getTeamMembersByUserId(id: number): Promise<TeamMember[]>  {
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                user: {
                    id: id
                }
            }
        };
        return this.teamMemberRepository.find(options);
    }

    async saveTeamMember(teamMember: TeamMember): Promise<TeamMember | undefined> {
        return await this.teamMemberRepository.save(teamMember);
    }

    async removeTeamMember(teamMember: TeamMember): Promise<TeamMember | undefined> {
        return await this.teamMemberRepository.remove(teamMember);
    }
}
