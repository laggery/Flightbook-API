import { Injectable, Req } from '@nestjs/common';
import { FlightService } from './flight.service';
import { UserService } from 'src/user/user.service';
import { FlightDto } from './interface/flight-dto';
import { Flight } from './flight.entity';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/user.entity';
import { PlaceFacade } from 'src/place/place.facade';
import { Place } from 'src/place/place.entity';
import { InvalidDateException } from './exception/invalid-date-exception';
import { InvalidGliderException } from './exception/invalid-glider-exception';
import { GliderFacade } from 'src/glider/glider.facade';
import { Glider } from 'src/glider/glider.entity';
import { FlightStatisticDto } from './interface/flight-statistic-dto';
import { PagerDto } from 'src/interface/pager-dto';
import moment = require('moment');
import { checkIfDateIsValid } from '../shared/util/date-utils';
import { FileUploadService } from 'src/fileupload/file-upload.service';

@Injectable()
export class FlightFacade {

    constructor(
        private flightService: FlightService,
        private placeFacade: PlaceFacade,
        private gliderFacade: GliderFacade,
        private userService: UserService,
        private fileUploadService: FileUploadService
    ) { }

    async getFlights(token: any, query: any): Promise<FlightDto[]> {
        const list: Flight[] = await this.flightService.getFlights(token, query);
        return plainToClass(FlightDto, list);
    }

    async getFlightsPager(token: any, query: any): Promise<PagerDto> {
        return this.flightService.getFlightsPager(token, query);
    }

    async getStatistic(token: any, query: any): Promise<FlightStatisticDto | FlightStatisticDto[]> {
        return this.flightService.getStatistic(token, query);
    }

    async createFlight(token: any, flightDto: FlightDto): Promise<FlightDto> {
        const user: User = await this.userService.getUserById(token.userId);
        let flight: Flight = plainToClass(Flight, flightDto);

        flight = await this.flightValidityCheck(flightDto, flight, token);

        flight.id = null;
        flight.user = user;

        const flightResp: Flight = await this.flightService.saveFlight(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async updateFlight(token: any, id: number, flightDto: FlightDto): Promise<FlightDto> {
        let flight: Flight = await this.flightService.getFlightById(token, id);

        flight = await this.flightValidityCheck(flightDto, flight, token);

        flight.time = flightDto.time;
        flight.km = flightDto.km;
        flight.description = flightDto.description;
        flight.price = flightDto.price;
        flight.igc = flightDto.igc;

        const flightResp: Flight = await this.flightService.saveFlight(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async removeFlight(token: any, id: number): Promise<FlightDto> {
        const flight: Flight = await this.flightService.getFlightById(token, id);
        const flightResp: Flight = await this.flightService.removeFlight(flight);
        if (flight.igc && flight.igc.filepath){
            this.fileUploadService.deleteFile(token.userId, flight.igc.filepath);
        }
        return plainToClass(FlightDto, flightResp);
    }

    private async flightValidityCheck(flightDto: FlightDto, flight: Flight, token: any) {
        const { start, date, time, glider, landing } = flightDto;

        if (checkIfDateIsValid(date)) {
            throw new InvalidDateException();
        }

        // format date
        if (date) {
            flight.date = moment(date).format('YYYY-MM-DD');
        }

        // Check if glider exist 
        if (!glider) {
            throw new InvalidGliderException();
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
            throw new InvalidGliderException();
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
