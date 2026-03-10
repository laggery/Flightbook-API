import { Injectable } from '@nestjs/common';
import { TandemPilotRepository } from './tandem-pilot.repository';
import { SchoolDto } from '../school/interface/school-dto';
import { TandemPilot } from './tandem-pilot.entity';
import { plainToInstance } from 'class-transformer';
import { TandemPilotDto } from './interface/tandem-pilot-dto';
import { TandemPilotException } from './exception/tandem-pilot.exception';
import { PassengerConfirmationDto } from '../../tandem/passenger-confirmation/interface/passenger-confirmation-dto';
import { PassengerConfirmationFacade } from '../../tandem/passenger-confirmation/passenger-confirmation.facade';
import { PagerEntityDto } from 'src/interface/pager-entity-dto';
import { FlightDto } from 'src/flight/interface/flight-dto';
import { FlightFacade } from 'src/flight/flight.facade';
import { SchoolException } from '../school/exception/school.exception';
import { SchoolRepository } from '../school/school.repository';
import { TandemSchoolDataDto } from 'src/flight/interface/tandem-school-data-dto';

@Injectable()
export class TandemPilotFacade {

    constructor(
        private tandemPilotRepository: TandemPilotRepository,
        private schoolRepository: SchoolRepository,
        private passengerConfirmationFacade: PassengerConfirmationFacade,
        private flightFacade: FlightFacade
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

    async archiveTandemPilot(tandemPilotId: number) {
        const tandemPilot = await this.tandemPilotRepository.getTandemPilotById(tandemPilotId);
        if (!tandemPilot) {
            throw TandemPilotException.notFoundException();
        }

        tandemPilot.isArchived = true;
        tandemPilot.timestamp = new Date();

        const tandemPilotResp = await this.tandemPilotRepository.save(tandemPilot);
        return plainToInstance(TandemPilotDto, tandemPilotResp);
    }

    async getPassengerConfirmationsByTandemPilotId(tandemPilotId: number, query: any): Promise<PagerEntityDto<PassengerConfirmationDto[]>> {
        const tandemPilot = await this.tandemPilotRepository.getTandemPilotById(tandemPilotId);

        if (!tandemPilot) {
            throw TandemPilotException.notFoundException();
        }
        return await this.passengerConfirmationFacade.getPassengerConfirmations(tandemPilot.user.id, query);
    }

    async getTandemPilotFlights(schoolId: number, tandemPilotId: number, query: any): Promise<PagerEntityDto<FlightDto[]>> {
        const tandemPilot = await this.tandemPilotRepository.getTandemPilotById(tandemPilotId);
        if (!tandemPilot) {
            throw TandemPilotException.notFoundException();
        }
        if (tandemPilot.isArchived) {
            query.timestamp = tandemPilot.timestamp;
        }

        query["tandem-school-id"] = schoolId;

        return await this.flightFacade.getFlightsPager({ userId: tandemPilot.user.id }, query);
    }

    async validateTandemPilotFlight(tandemPilotId: number, flightId: number, schoolId: number, userId: number, tandemSchoolDataDto: TandemSchoolDataDto): Promise<FlightDto> {
        const tandemPilot = await this.tandemPilotRepository.getTandemPilotById(tandemPilotId);
        if (!tandemPilot) {
            throw TandemPilotException.notFoundException();
        }

        const school = await this.schoolRepository.getSchoolById(schoolId);
        if (!school) {
            throw SchoolException.notFoundException();
        }
        
        return await this.flightFacade.updateFlightPayment({ userId: tandemPilot.user.id }, flightId, school, userId, tandemSchoolDataDto);
    }
}
