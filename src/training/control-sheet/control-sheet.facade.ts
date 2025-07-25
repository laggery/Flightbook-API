import { Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from '../../user/user.entity';
import { UserRepository } from '../../user/user.repository';
import { AltitudeFlight } from './altitude-flight.entity';
import { ControlSheet } from './control-sheet.entity';
import { ControlSheetRepository } from './control-sheet.repository';
import { ControlSheetDto } from './interface/control-sheet-dto';
import { Theory } from './theory.entity';
import { TrainingHill } from './training-hill.entity';
import { ControlSheetException } from './exception/control-sheet.exception';
import { Level } from './level.entity';

@Injectable()
export class ControlSheetFacade {

    constructor(
        private readonly controlSheetRepository: ControlSheetRepository,
        private readonly userRepository: UserRepository
    ) { }

    async studentCreateUpdateControlSheet(token: any, controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        const currentSheet = await this.controlSheetRepository.getControlSheetByUserId(token.userId);
        if (currentSheet && !currentSheet.userCanEdit) {
            ControlSheetException.forbiddenToEdit();
        }
        const controlSheet: ControlSheet = plainToInstance(ControlSheet, controlSheetDto);
        controlSheet.userCanEdit = undefined;
        controlSheet.level = currentSheet.level;
        return this.createUpdateControlSheet(token, controlSheet);
    }

    async instructorCreateUpdateControlSheet(token: any, controlSheetDto: ControlSheetDto): Promise<ControlSheetDto> {
        const controlSheet: ControlSheet = plainToInstance(ControlSheet, controlSheetDto);
        return this.createUpdateControlSheet(token, controlSheet);
    }

    private async createUpdateControlSheet(token: any, controlSheet: ControlSheet): Promise<ControlSheetDto> {

        const user: User = await this.userRepository.getUserById(token.userId);

        if (!controlSheet.altitudeFlight) {
            controlSheet.altitudeFlight = new AltitudeFlight();
        }

        if (!controlSheet.trainingHill) {
            controlSheet.trainingHill = new TrainingHill();
        }

        if (!controlSheet.theory) {
            controlSheet.theory = new Theory();
        }

        if (!controlSheet.level) {
            controlSheet.level = new Level();
        }

        if (controlSheet.passTheoryExam === undefined) {
            controlSheet.passTheoryExam = null;
        }
        if (controlSheet.passPracticeExam === undefined) {
            controlSheet.passPracticeExam = null;
        }

        const current = await this.controlSheetRepository.getControlSheetByUserId(user.id);

        if (current) {
            controlSheet.id = current.id;
            controlSheet.trainingHill.id = current.trainingHill.id;
            controlSheet.theory.id = current.theory.id;
            controlSheet.altitudeFlight.id = current.altitudeFlight.id;
            controlSheet.level.id = current.level?.id
        }
        controlSheet.user = user;

        const controlSheetResp = this.controlSheetRepository.save(controlSheet);
        return plainToClass(ControlSheetDto, controlSheetResp);
    }

    async getControlSheet(token: any): Promise<ControlSheetDto> {
        const controlSheet = await this.controlSheetRepository.getControlSheetByUserId(token.userId);
        if (controlSheet && !controlSheet.level) {
            controlSheet.level = new Level();
        }
        return plainToClass(ControlSheetDto, controlSheet);
    }
}
