import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlSheet } from './control-sheet.entity';

@Injectable()
export class ControlSheetRepository extends Repository<ControlSheet>{

    constructor(
        @InjectRepository(ControlSheet)
        private readonly repository: Repository<ControlSheet>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getControlSheetByUserId(userId: number) {
        if (!userId) {
            return undefined;
        }
        let options: any = {
            relations: {
                theory: true,
                altitudeFlight: true,
                trainingHill: true
            },
            where: {
                user: {
                    id: userId
                }
            }
        };
        return await this.repository.findOne(options);
    }
}
