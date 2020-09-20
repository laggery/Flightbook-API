import { Injectable } from '@nestjs/common';
import { FlightService } from './flight.service';
import { UserService } from 'src/user/user.service';
import { FlightDto } from './interface/flight-dto';
import { Flight } from './flight.entity';
import { plainToClass } from 'class-transformer';
import { User } from 'src/user/user.entity';
import moment = require('moment');
import { PlaceFacade } from 'src/place/place.facade';
import { Place } from 'src/place/place.entity';
import { InvalidDateException } from './exception/invalid-date-exception';
import { InvalidGliderException } from './exception/invalid-glider-exception';
import { GliderFacade } from 'src/glider/glider.facade';
import { Glider } from 'src/glider/glider.entity';
import { FlightStatisticDto } from './interface/flight-statistic-dto';

@Injectable()
export class FlightFacade {

    constructor(
        private flightService: FlightService,
        private placeFacade: PlaceFacade,
        private gliderFacade: GliderFacade,
        private userService: UserService
    ) { }

    async getFLights(token: any, query: any): Promise<FlightDto[]> {
        const list: Flight[] = await this.flightService.getFLights(token, query);
        return plainToClass(FlightDto, list);
    }

    async getStatistic(token: any, query: any): Promise<FlightStatisticDto> {
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

        const flightResp: Flight = await this.flightService.saveFlight(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async removeFlight(token: any, id: number): Promise<FlightDto> {
        const flight: Flight = await this.flightService.getFlightById(token, id);
        const flightResp: Flight = await this.flightService.removeFlight(flight);
        return plainToClass(FlightDto, flightResp);
    }

    private async flightValidityCheck(flightDto: FlightDto, flight: Flight, token: any) {
        // check if date is valide
        if (!flightDto.date || (flightDto.date && Number.isNaN(Date.parse(flightDto.date)))) {
            throw new InvalidDateException();
        }

        // format date
        if (flightDto.date) {
            flight.date = moment(flightDto.date).format('YYYY-MM-DD');
        }

        // Check if glider exist 
        if (!flightDto.glider) {
            throw new InvalidGliderException();
        }

        if (flightDto.time && moment(flightDto.time, "HH:mm").isValid()) {
            if (!Number.isNaN(Date.parse(flightDto.time))) {
                flight.time = moment(flightDto.time).format('HH:mm');
            }
        }

        // Check if glider is valid
        try {
            const gliderDto = await this.gliderFacade.getGliderById(token, flightDto.glider.id)
            flight.glider = plainToClass(Glider, gliderDto);
        } catch (e) {
            throw new InvalidGliderException();
        }

        // Check if start an landing exist and if not create it
        if (flightDto.start && flightDto.start.name) {
            let startDto = await this.placeFacade.getPlaceByName(token, flightDto.start.name);
            if (!startDto) {
                startDto = await this.placeFacade.createPlace(token, flightDto.start);
            }
            flight.start = plainToClass(Place, startDto);
        }
        if (flightDto.landing && flightDto.landing.name) {
            let landingDto = await this.placeFacade.getPlaceByName(token, flightDto.landing.name);
            if (!landingDto) {
                landingDto = await this.placeFacade.createPlace(token, flightDto.landing);
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
