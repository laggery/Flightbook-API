import { Injectable, BadRequestException } from '@nestjs/common';
import { Flight } from './flight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, getManager } from 'typeorm';
import { FlightStatisticDto } from './interface/flight-statistic-dto';
import { Glider } from 'src/glider/glider.entity';
import { Place } from 'src/place/place.entity';
import { PagerDto } from 'src/interface/pager-dto';

@Injectable()
export class FlightService {

    constructor(
        @InjectRepository(Flight)
        private readonly flightRepository: Repository<Flight>
    ) { }

    // @hack for use ROW_NUMBER function from mysql with typeorm
    async getFLights(token: any, query: any): Promise<Flight[]> {
        let builder: SelectQueryBuilder<Flight> = this.flightRepository.createQueryBuilder('flight')
            .addSelect('flight_number')
            .leftJoinAndSelect('flight.glider', 'glider', 'glider.id = flight.glider_id')
            .leftJoinAndSelect('flight.start', 'start', 'start.id = flight.start_id')
            .leftJoinAndSelect('flight.landing', 'landing', 'landing.id = flight.landing_id')
            .where(`flight.user_id = ${token.userId}`);

        builder = this.addQueryParams(builder, query);
        builder.orderBy('flight.date', 'DESC');
        builder.addOrderBy('flight.timestamp', 'DESC');

        let sqlRequest = builder.getSql();
        sqlRequest = sqlRequest.replace('FROM "public"."flight" "flight"', ` FROM (Select ROW_NUMBER() OVER (ORDER BY flight.date ASC) flight_number, flight.* from flight where user_id = ${token.userId}) as flight`)
        if (query && query.limit) { sqlRequest = sqlRequest + ` LIMIT ${query.limit}`}
        if (query && query.offset) { sqlRequest = sqlRequest + ` OFFSET ${query.offset}`}

        let res: [] = await getManager().query(sqlRequest);

        let list: Flight[] = [];
        res.forEach((raw: Object) => {
            let data = new Flight();
            Object.keys(raw).forEach(key => {
                if (key.startsWith('flight')) {
                    let name = key.substring(7, key.length);
                    data[name] = raw[key];
                }
                if (key.startsWith('glider')) {
                    if (!data.glider) data.glider = new Glider();
                    let name = key.substring(7, key.length);
                    data["glider"][name] = raw[key];
                }
                if (key.startsWith('start')) {
                    if (!data.start) data.start = new Place();
                    let name = key.substring(6, key.length);
                    data["start"][name] = raw[key];
                }
                if (key.startsWith('landing')) {
                    if (!data.landing) data.landing = new Place();
                    let name = key.substring(8, key.length);
                    data["landing"][name] = raw[key];
                }
            })
            list.push(data)
        })

        return list;
    }

    async getStatistic(token: any, query: any): Promise<FlightStatisticDto | FlightStatisticDto[]> {
        let builder = this.flightRepository.createQueryBuilder('flight')
            .select('count(flight.id)', "nbFlights")
            .addSelect("EXTRACT(epoch FROM Sum(flight.time))", "time")
            .addSelect('Sum(flight.price)', "income")
            .addSelect('EXTRACT(epoch FROM Avg(flight.time))', "average")
            .leftJoin('flight.user', 'user', 'user.id = flight.user_id')
            .leftJoin('flight.glider', 'glider', 'glider.id = flight.glider_id')
            .where(`user.id = ${token.userId}`);

        builder = this.addQueryParams(builder, query);

        let statistic: FlightStatisticDto = await builder.getRawOne();

        if (query.years && query.years === "1") {
            let builderYears = this.flightRepository.createQueryBuilder('flight')
            .select('EXTRACT(YEAR FROM "flight"."date")', "year")
            .addSelect('count(flight.id)', "nbFlights")
            .addSelect("EXTRACT(epoch FROM Sum(flight.time))", "time")
            .addSelect('Sum(flight.price)', "income")
            .addSelect('EXTRACT(epoch FROM Avg(flight.time))', "average")
            .leftJoin('flight.user', 'user', 'user.id = flight.user_id')
            .leftJoin('flight.glider', 'glider', 'glider.id = flight.glider_id')
            .where(`user.id = ${token.userId}`)
            .groupBy('EXTRACT(YEAR FROM "flight"."date")')
            .orderBy('year', "ASC");

            builderYears = this.addQueryParams(builderYears, query);

            let statisticList: FlightStatisticDto[] = await builderYears.getRawMany();
            statisticList.splice(0, 0, statistic);
            return statisticList;
        }

        return statistic;
    }

    async saveFlight(flight: Flight): Promise<Flight | undefined> {
        return await this.flightRepository.save(flight);
    }

    async removeFlight(flight: Flight): Promise<Flight | undefined> {
        return await this.flightRepository.remove(flight);
    }

    async getFlightById(token: any, id: number): Promise<Flight> {
        return this.flightRepository.findOneOrFail({ id: id, user: { id: token.userId } });
    }

    async getFlightsPager(token: any, query: any): Promise<PagerDto> {
        let pagerDto = new PagerDto();

        let builder = this.flightRepository.createQueryBuilder('flight')
            .leftJoinAndSelect('flight.glider', 'glider', 'glider.id = flight.glider_id')
            .leftJoinAndSelect('flight.start', 'start', 'start.id = flight.start_id')
            .leftJoinAndSelect('flight.landing', 'landing', 'landing.id = flight.landing_id')
            .where(`flight.user_id = ${token.userId}`);

        builder = this.addQueryParams(builder, query);
        let entityNumber: [Flight[], number] = await builder.getManyAndCount();

        pagerDto.itemCount = entityNumber[0].length;
        pagerDto.totalItems = entityNumber[1];
        pagerDto.itemsPerPage = (query && query.limit) ? Number(query.limit) : pagerDto.itemCount;
        pagerDto.totalPages =  (query && query.limit) ?  Math.ceil(pagerDto.totalItems / Number(query.limit)) : pagerDto.totalItems;
        pagerDto.currentPage = (query && query.offset) ? (query.offset >= pagerDto.totalItems ? null : Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1) : 1;
        return pagerDto;
    }

    private addQueryParams(builder: SelectQueryBuilder<Flight>, query: any): SelectQueryBuilder<Flight> {
        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            };
            builder.take(query.limit)
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            };
            builder.skip(query.offset);
        }

        if (query && query.glider) {
            if (Number.isNaN(Number(query.glider))) {
                throw new BadRequestException("glider is not a number");
            };
            builder.andWhere(`glider.id = ${query.glider}`);
        }

        if (query && query["glider-type"]) {
            if (Number.isNaN(Number(query["glider-type"]))) {
                throw new BadRequestException("type is not a 0 or 1");
            };
            builder.andWhere(`glider.tandem = ${Number(query["glider-type"]) ? true : false}`)
        }

        if (query && query.from) {
            builder.andWhere(`flight.date >= '${query.from}'`);
        }

        if (query && query.to) {
            builder.andWhere(`flight.date <= '${query.to}'`);
        }
        return builder
    }

    async countFlightsByPlaceId(token: any, placeId: number): Promise<any> {
        let builder = this.flightRepository.createQueryBuilder('flight')
            .select('distinct count(flight.id)', "nbFlights")
            .leftJoin('flight.user', 'user', 'user.id = flight.user_id')
            .where(`user.id = ${token.userId}`)
            .andWhere(`flight.start_id = ${placeId} OR flight.landing_id = ${placeId}`)

        return builder.getRawOne();
    }

    async countFlightsByGliderId(token: any, gliderId: number): Promise<any> {
        let builder = this.flightRepository.createQueryBuilder('flight')
            .select('distinct count(flight.id)', "nbFlights")
            .leftJoin('flight.user', 'user', 'user.id = flight.user_id')
            .where(`user.id = ${token.userId}`)
            .andWhere(`flight.glider_id = ${gliderId}`)

        return builder.getRawOne();
    }
}
