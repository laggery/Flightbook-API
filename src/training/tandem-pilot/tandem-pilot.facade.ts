import { Injectable } from '@nestjs/common';
import { TandemPilotRepository } from './tandem-pilot.repository';
import { SchoolDto } from '../school/interface/school-dto';
import { TandemPilot } from './tandem-pilot.entity';
import { plainToInstance } from 'class-transformer';
import { TandemPilotDto } from './interface/tandem-pilot-dto';

@Injectable()
export class TandemPilotFacade {

    constructor(
        private tandemPilotRepository: TandemPilotRepository
    ) { }

    async getTandemPilotsBySchoolId(id: number, archived: boolean): Promise<TandemPilotDto[]> {
        const tandemPilots = await this.tandemPilotRepository.getTandemPilotsBySchoolId(id, archived);
        return plainToInstance(TandemPilotDto, tandemPilots);
    }

    async getTandemSchoolsByUserId(id: number): Promise<SchoolDto[]> {
        const tandemPilots = await this.tandemPilotRepository.getTandemPilotsByUserId(id);
        const schoolsDto: SchoolDto[] = [];

        tandemPilots.forEach((tandemPilot: TandemPilot) => {
            schoolsDto.push(plainToInstance(SchoolDto, tandemPilot.school));
        });

        return schoolsDto;
    }
}
