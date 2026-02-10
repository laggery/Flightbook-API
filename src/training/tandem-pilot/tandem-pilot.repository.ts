import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TandemPilot } from './tandem-pilot.entity';

@Injectable()
export class TandemPilotRepository extends Repository<TandemPilot> {
    constructor(
        @InjectRepository(TandemPilot)
        private readonly repository: Repository<TandemPilot>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    // async getTandemPilotById(id: number): Promise<TandemPilot> {
    //     return this.repository.findOneOrFail({
    //         relations: {
    //             user: true,
    //             school: true
    //         },
    //         where: {
    //             id
    //         }
    //     });
    // }

    async getTandemPilotsBySchoolId(schoolId: number, archived?: boolean): Promise<TandemPilot[]> {
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
        if (archived != undefined) {
            options.where.isArchived = archived;
        }
        return this.repository.find(options);
    }

    async getTandemPilotsByUserId(userId: number): Promise<TandemPilot[]> {
        let options: any = {
            relations: {
                user: true,
                school: true
            },
            where: {
                user: {
                    id: userId
                }
            }
        };
        return this.repository.find(options);
    }
}
