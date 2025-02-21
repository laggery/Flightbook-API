import { Injectable, Req } from '@nestjs/common';
import { FlightRepository } from './flight.repository';
import { UserRepository } from '../user/user.repository';
import { FlightDto } from './interface/flight-dto';
import { Flight } from './flight.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from '../user/user.entity';
import { PlaceFacade } from '../place/place.facade';
import { Place } from '../place/place.entity';
import { GliderFacade } from '../glider/glider.facade';
import { Glider } from '../glider/glider.entity';
import { FlightStatisticDto } from './interface/flight-statistic-dto';
import moment = require('moment');
import { checkIfDateIsValid } from '../shared/util/date-utils';
import { FileUploadService } from '../fileupload/file-upload.service';
import { PagerEntityDto } from '../interface/pager-entity-dto';
import { StatisticType } from './statistic-type';
import { FlightException } from './exception/flight.exception';

@Injectable()
export class FlightFacade {

    constructor(
        private flightService: FlightRepository,
        private placeFacade: PlaceFacade,
        private gliderFacade: GliderFacade,
        private userRepository: UserRepository,
        private fileUploadService: FileUploadService
    ) { }

    async getFlights(token: any, query: any): Promise<FlightDto[]> {
        const list: Flight[] = await this.flightService.getFlights(token, query);
        return plainToInstance(FlightDto, list);
    }

    async getFlightsPager(token: any, query: any): Promise<PagerEntityDto<FlightDto[]>> {
        const promiseList = [];
        promiseList.push(this.flightService.getFlightsPager(token, query));
        if (!query.limit) {
            query.limit = 100;
        }
        promiseList.push(this.flightService.getFlights(token, query));

        let response = await Promise.all(promiseList);
        const pagerDto = response[0] as PagerEntityDto<FlightDto[]>;
        pagerDto.entity = plainToInstance(FlightDto, response[1] as Flight[]);
        return pagerDto;
    }

    async getStatisticV1(token: any, query: any): Promise<FlightStatisticDto | FlightStatisticDto[]> {
        const statList: FlightStatisticDto[] = [];
        statList.push(await this.flightService.getGlobalStatistic(token, query));
        if (query.years && query.years === "1") {
            statList.push(...await this.flightService.getStatisticYears(token, query))
            return statList;
        }
    
        return statList[0];
    }

    async getStatisticV2(token: any, query: any): Promise<FlightStatisticDto[]> {
        if (!query.type || query.type == StatisticType.YEARLY) {
            return this.flightService.getStatisticYears(token, query);
        } else if (query.type == StatisticType.MONTHLY) {
            return this.flightService.getStatisticMonth(token, query);
        } else if (query.type == StatisticType.GLOBAL) {
            const list: FlightStatisticDto[] = []
            list.push(await this.flightService.getGlobalStatistic(token, query));
            return list;
        }
        return [];
    }

    async getGlobalStatistic(token: any, query: any): Promise<FlightStatisticDto> {
        return this.flightService.getGlobalStatistic(token, query);
    }

    async createFlight(token: any, flightDto: FlightDto): Promise<FlightDto> {
        const user: User = await this.userRepository.getUserById(token.userId);
        let flight: Flight = plainToClass(Flight, flightDto);

        flight = await this.flightValidityCheck(flightDto, flight, token);

        flight.id = null;
        flight.user = user;

        const flightResp: Flight = await this.flightService.save(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async updateFlight(token: any, id: number, flightDto: FlightDto): Promise<FlightDto> {
        let flight: Flight = await this.flightService.getFlightById(token, id);

        if (!flight) {
            FlightException.notFoundException();
        }

        flight = await this.flightValidityCheck(flightDto, flight, token);

        flight.time = flightDto.time;
        flight.km = flightDto.km;
        flight.description = flightDto.description;
        flight.price = flightDto.price;
        flight.igc = flightDto.igc;
        flight.shvAlone = flightDto.shvAlone;

        const flightResp: Flight = await this.flightService.save(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async updateFlightAlone(token: any, id: number, flightDto: FlightDto): Promise<FlightDto> {
        let flight: Flight = await this.flightService.getFlightById(token, id);

        if (!flight) {
            FlightException.notFoundException();
        }

        flight.shvAlone = flightDto.shvAlone === undefined ? false : flightDto.shvAlone;

        const flightResp: Flight = await this.flightService.save(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async removeFlight(token: any, id: number): Promise<FlightDto> {
        const flight: Flight = await this.flightService.getFlightById(token, id);
        const flightResp: Flight = await this.flightService.remove(flight);
        if (flight.igc && flight.igc.filepath){
            this.fileUploadService.deleteFile(token.userId, flight.igc.filepath);
        }
        return plainToClass(FlightDto, flightResp);
    }

    private async flightValidityCheck(flightDto: FlightDto, flight: Flight, token: any) {
        const { start, date, time, glider, landing } = flightDto;

        if (checkIfDateIsValid(date)) {
            FlightException.invalidDateException();
        }

        // format date
        if (date) {
            flight.date = moment(date).format('YYYY-MM-DD');
        }

        // Check if glider exist 
        if (!glider) {
            FlightException.invalidGliderException();
        }

        if (time && moment(time, "HH:mm").isValid()) {
            if (!Number.isNaN(Date.parse(time))) {
                flight.time = moment(time).format('HH:mm');
            }
        }

        // Check if glider is valid
        try {
            const gliderDto = await this.gliderFacade.getGliderById(token, glider.id)
            flight.glider = plainToClass(Glider, gliderDto);
        } catch (e) {
            FlightException.invalidGliderException();
        }

        // Check if start an landing exist and if not create it
        if (start && start.name) {
            let startDto = await this.placeFacade.getPlaceByName(token, start.name);
            if (!startDto) {
                startDto = await this.placeFacade.createPlace(token, start);
            }
            flight.start = plainToClass(Place, startDto);
        }
        if (landing?.name) {
            let landingDto = await this.placeFacade.getPlaceByName(token, landing.name);
            if (!landingDto) {
                landingDto = await this.placeFacade.createPlace(token, landing);
            }
            flight.landing = plainToClass(Place, landingDto);
        }

        return flight;
    }

    async nbFlightsByPlaceId(token: any, placeId: number) {
        return this.flightService.countFlightsByPlaceId(token, placeId);
    }

    async nbFlightsByGliderId(token: any, gliderId: number) {
        return this.flightService.countFlightsByGliderId(token, gliderId);
    }

}
