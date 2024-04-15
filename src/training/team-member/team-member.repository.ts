import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember } from './team-member.entity';

@Injectable()
export class TeamMemberRepository extends Repository<TeamMember> {

    constructor(
        @InjectRepository(TeamMember)
        private readonly repository: Repository<TeamMember>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

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
        return this.find(options);
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
        return this.findOne(options);
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
        return this.find(options);
    }

    async getTeamMembersByUserIdAndSchoolId(schoolId: number, userId: number): Promise<TeamMember>  {
        if (!schoolId || !userId) {
            return undefined;
        }
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                user: {
                    id: userId
                },
                school: {
                    id: schoolId
                }
            }
        };
        return this.findOne(options);
    }
}
