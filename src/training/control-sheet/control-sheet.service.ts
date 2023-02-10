import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlSheet } from './control-sheet.entity';

@Injectable()
export class ControlSheetService{

    constructor(
        @InjectRepository(ControlSheet)
        private readonly controlSheetService: Repository<ControlSheet>
    ) { }

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
        return await this.controlSheetService.findOne(options);
    }

    async save(place: ControlSheet) {
        return await this.controlSheetService.save(place);
    }
}
