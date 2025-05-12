import { Injectable, BadRequestException } from '@nestjs/common';
import { Flight } from './flight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FlightStatisticDto } from './interface/flight-statistic-dto';
import { Glider } from '../glider/glider.entity';
import { Place } from '../place/place.entity';
import { PagerDto } from '../interface/pager-dto';
import { FlightValidation } from './flight-validation.entity';
import { FlightValidationState } from './flight-validation-state';

@Injectable()
export class FlightRepository extends Repository<Flight> {

    constructor(
        @InjectRepository(Flight)
        private readonly repository: Repository<Flight>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

    // @hack for use ROW_NUMBER function from mysql with typeorm
    async getFlights(token: any, query: any): Promise<Flight[]> {
        let builder: SelectQueryBuilder<Flight> = this.repository.createQueryBuilder('flight')
            .addSelect('flight_number')
            .leftJoinAndSelect('flight.glider', 'glider', 'glider.id = flight.glider_id')
            .leftJoinAndSelect('flight.start', 'start', 'start.id = flight.start_id')
            .leftJoinAndSelect('flight.landing', 'landing', 'landing.id = flight.landing_id')
            .where(`flight.user_id = ${token.userId}`);

        builder = FlightRepository.addQueryParams(builder, query);
        builder.orderBy('flight.date', 'DESC');
        builder.addOrderBy('flight.flight_number', 'DESC');
        builder.addOrderBy('flight.timestamp', 'DESC');

        let sqlRequest = builder.getSql();
        sqlRequest = sqlRequest.replace('FROM "data"."flight" "flight"', ` FROM (Select ROW_NUMBER() OVER (ORDER BY flight.date ASC, flight.timestamp ASC) flight_number, flight.* from data.flight where user_id = ${token.userId}) as flight`)
        if (query && query.limit) { sqlRequest = sqlRequest + ` LIMIT ${query.limit}` }
        if (query && query.offset) { sqlRequest = sqlRequest + ` OFFSET ${query.offset}` }

        const res: [] = await this.repository.query(sqlRequest);

        const list: Flight[] = [];
        res.forEach((raw: Record<string, Flight>) => {
            const data = new Flight();
            Object.keys(raw).forEach(key => {
                if (key.startsWith('flight')) {
                    if (key.startsWith('flight_shv_alone')) {
                        const name = key.substring(7, key.length);
                        data.shvAlone = Boolean(raw[key]);
                    } else if (key.startsWith('flight_validation')) {
                        // @Hack -> Shoud be refactored
                        if (!data.validation) data.validation = new FlightValidation();
                        const name = key.substring(18, key.length);
                        if (name !== 'user_id' && name !== 'school_id') {
                            data["validation"][name] = raw[key];
                        }
                    } else {
                        const name = key.substring(7, key.length);
                        data[name] = raw[key];
                    }
                }
                if (key.startsWith('glider')) {
                    if (!data.glider) data.glider = new Glider();
                    const name = key.substring(7, key.length);
                    data["glider"][name] = raw[key];
                }
                if (key.startsWith('start')) {
                    if (!data.start) data.start = new Place();
                    const name = key.substring(6, key.length);
                    data["start"][name] = raw[key];
                }
                if (key.startsWith('landing')) {
                    if (!data.landing) data.landing = new Place();
                    const name = key.substring(8, key.length);
                    data["landing"][name] = raw[key];
                }
            })
            list.push(data)
        });

        return list;
    }

    async getGlobalStatistic(token: any, query: any): Promise<FlightStatisticDto> {
        let builder = this.repository.createQueryBuilder('flight')
            .select('count(flight.id)::int', "nbFlights")
            .addSelect("EXTRACT(epoch FROM Sum(flight.time))", "time")
            .addSelect('Sum(flight.price)', "income")
            .addSelect('Sum(flight.km)', "totalDistance")
            .addSelect('Max(flight.km)', "bestDistance")
            .addSelect('EXTRACT(epoch FROM Avg(flight.time))', "average")
            .addSelect('count(DISTINCT(flight.start_id))::int', "nbStartplaces")
            .addSelect('count(DISTINCT(flight.landing_id))::int', "nbLandingplaces")
            .leftJoin('flight.user', 'user', 'user.id = flight.user_id')
            .leftJoin('flight.glider', 'glider', 'glider.id = flight.glider_id')
            .where(`user.id = ${token.userId}`);

        builder = FlightRepository.addQueryParams(builder, query);
        return builder.getRawOne();
    }

    async getStatisticYears(token: any, query: any): Promise<FlightStatisticDto[]> {
        let maxdate = this.repository.createQueryBuilder("flight")
            .select("max(date) + interval '1 year'")
            .where(`flight.user_id = ${token.userId}`)
            .leftJoin('flight.glider', 'glider');
        maxdate = FlightRepository.addQueryParams(maxdate, query);

        let mindate = this.repository.createQueryBuilder("flight")
            .select("min(date)")
            .where(`flight.user_id = ${token.userId}`)
            .leftJoin('flight.glider', 'glider');
        mindate = FlightRepository.addQueryParams(mindate, query);

        let builder = this.repository.manager.createQueryBuilder()
            .select("'yearly'", "type")
            .addSelect("to_char(year, 'YYYY')", "year")
            .addSelect("coalesce(nb_flight, 0)", "nbFlights")
            .addSelect("coalesce(time, 0)", "time")
            .addSelect("coalesce(income, 0)", "income")
            .addSelect("coalesce(average, 0)", "average")
            .addSelect("coalesce(total_distance, 0)", "totalDistance")
            .addSelect("coalesce(best_distance, 0)", "bestDistance")
            .addFrom((qb) => {
                return qb.select(`date_trunc('year',generate_series((${mindate.getSql()})::DATE, (${maxdate.getSql()})::DATE, '1 year'))`, "year")
                    .fromDummy();
            }, "m")
            .leftJoin((qb) => {
                let builder = qb.select("date_trunc('year',date)", "sub_year")
                    .addSelect("COUNT(*)::int", "nb_flight")
                    .addSelect("EXTRACT(epoch FROM Sum(flight.time))", "time")
                    .addSelect("Sum(price)", "income")
                    .addSelect('EXTRACT(epoch FROM Avg(flight.time))', "average")
                    .addSelect('Sum(flight.km)', "total_distance")
                    .addSelect('Max(flight.km)', "best_distance")
                    .addFrom(Flight, "flight")
                    .where(`flight.user_id = ${token.userId}`)
                    .leftJoin('flight.glider', 'glider')
                    .groupBy('sub_year');

                builder = FlightRepository.addQueryParams(builder, query);

                return builder;

            }, "counts", "m.year = counts.sub_year")
            .orderBy("year")
            .take(900);

        return builder.getRawMany<FlightStatisticDto>();
    }

    async getStatisticMonth(token: any, query: any): Promise<FlightStatisticDto[]> {

        let maxdate = this.repository.createQueryBuilder("flight")
            .select("max(date) + interval '1 month'")
            .where(`flight.user_id = ${token.userId}`)
            .leftJoin('flight.glider', 'glider');;
        maxdate = FlightRepository.addQueryParams(maxdate, query);

        let mindate = this.repository.createQueryBuilder("flight")
            .select("min(date)")
            .where(`flight.user_id = ${token.userId}`)
            .leftJoin('flight.glider', 'glider');;
        mindate = FlightRepository.addQueryParams(mindate, query);

        let builder = this.repository.manager.createQueryBuilder()
            .select("'monthly'", "type")
            .addSelect("to_char(year_month, 'YYYY')", "year")
            .addSelect("to_char(year_month, 'MM')", "month")
            .addSelect("coalesce(nb_flight, 0)", "nbFlights")
            .addSelect("coalesce(time, 0)", "time")
            .addSelect("coalesce(income, 0)", "income")
            .addSelect("coalesce(average, 0)", "average")
            .addSelect("coalesce(total_distance, 0)", "totalDistance")
            .addSelect("coalesce(best_distance, 0)", "bestDistance")
            .addFrom((qb) => {
                return qb.select(`date_trunc('month',generate_series((${mindate.getSql()})::DATE, (${maxdate.getSql()})::DATE, '1 month'))`, "year_month")
                    .fromDummy();
            }, "m")
            .leftJoin((qb) => {
                let builder = qb.select("date_trunc('month',date)", "sub_year_month")
                    .addSelect("COUNT(*)::int", "nb_flight")
                    .addSelect("EXTRACT(epoch FROM Sum(flight.time))", "time")
                    .addSelect("Sum(price)", "income")
                    .addSelect('EXTRACT(epoch FROM Avg(flight.time))', "average")
                    .addSelect('Sum(flight.km)', "total_distance")
                    .addSelect('Max(flight.km)', "best_distance")
                    .addFrom(Flight, "flight")
                    .where(`flight.user_id = ${token.userId}`)
                    .leftJoin('flight.glider', 'glider')
                    .groupBy('sub_year_month');

                builder = FlightRepository.addQueryParams(builder, query);

                return builder;

            }, "counts", "m.year_month = counts.sub_year_month")
            .orderBy("year_month")
            .take(900);

        return builder.getRawMany<FlightStatisticDto>();
    }

    async getFlightById(token: any, id: number): Promise<Flight> {
        return this.repository.findOneByOrFail({ id: id, user: { id: token.userId } });
    }

    async getFlightsPager(token: any, query: any): Promise<PagerDto> {
        const pagerDto = new PagerDto();

        let builder = this.repository.createQueryBuilder('flight')
            .leftJoinAndSelect('flight.glider', 'glider', 'glider.id = flight.glider_id')
            .leftJoinAndSelect('flight.start', 'start', 'start.id = flight.start_id')
            .leftJoinAndSelect('flight.landing', 'landing', 'landing.id = flight.landing_id')
            .where(`flight.user_id = ${token.userId}`);

        builder = FlightRepository.addQueryParams(builder, query);
        const entityNumber: [Flight[], number] = await builder.getManyAndCount();

        pagerDto.itemCount = entityNumber[0].length;
        pagerDto.totalItems = entityNumber[1];
        pagerDto.itemsPerPage = (query?.limit) ? Number(query.limit) : pagerDto.itemCount;
        pagerDto.totalPages = (query?.limit) ? Math.ceil(pagerDto.totalItems / Number(query.limit)) : pagerDto.totalItems;
        pagerDto.currentPage = (query?.offset) ? (query.offset >= pagerDto.totalItems ? null : Math.floor(parseInt(query.offset) / parseInt(query.limit)) + 1) : 1;
        return pagerDto;
    }

    private static addQueryParams(builder: SelectQueryBuilder<any>, query: any): SelectQueryBuilder<any> {
        if (query && query.limit) {
            if (Number.isNaN(Number(query.limit))) {
                throw new BadRequestException("limit is not a number");
            }
            builder.take(query.limit)
        }

        if (query && query.offset) {
            if (Number.isNaN(Number(query.offset))) {
                throw new BadRequestException("offset is not a number");
            }
            builder.skip(query.offset);
        }

        if (query && query.glider) {
            if (Number.isNaN(Number(query.glider))) {
                throw new BadRequestException("glider is not a number");
            }
            builder.andWhere(`glider.id = ${query.glider}`);
        }

        if (query && query["glider-type"]) {
            if (Number.isNaN(Number(query["glider-type"]))) {
                throw new BadRequestException("type is not a 0 or 1");
            }
            builder.andWhere(`glider.tandem = ${Number(query["glider-type"]) ? true : false}`)
        }

        if (query && query.from) {
            builder.andWhere(`flight.date >= '${query.from}'`);
        }

        if (query && query.to) {
            builder.andWhere(`flight.date <= '${query.to}'`);
        }

        if (query && query.description) {
            builder.andWhere(`flight.description ILIKE '%${query.description}%'`);
        }

        if (query && query.timestamp) {
            builder.andWhere(`flight.timestamp <= '${new Date(query.timestamp).toISOString()}'`);
        }
        return builder
    }

    async countFlightsByPlaceId(token: any, placeId: number): Promise<any> {
        const builder = this.repository.createQueryBuilder('flight')
            .select('distinct count(flight.id)', "nbFlights")
            .leftJoin('flight.user', 'user', 'user.id = flight.user_id')
            .where(`user.id = ${token.userId}`)
            .andWhere(`flight.start_id = ${placeId} OR flight.landing_id = ${placeId}`)

        return builder.getRawOne();
    }

    async countFlightsByGliderId(token: any, gliderId: number): Promise<any> {
        const builder = this.repository.createQueryBuilder('flight')
            .select('distinct count(flight.id)', "nbFlights")
            .leftJoin('flight.user', 'user', 'user.id = flight.user_id')
            .where(`user.id = ${token.userId}`)
            .andWhere(`flight.glider_id = ${gliderId}`)

        return builder.getRawOne();
    }

    async countNotValidatedFlights(token: any, isTandem: boolean): Promise<number> {
        return this.createQueryBuilder('flight')
            .leftJoin('flight.glider', 'glider')
            .where('flight.validation_timestamp IS NULL')
            .andWhere(`flight.user_id = ${token.userId}`)
            .andWhere(`glider.tandem = ${isTandem}`)
            .getCount();
    }

    async validateAllFlight(token: any, schoolId: number, instructorId: number, state: FlightValidationState) {
        await this.createQueryBuilder()
            .update(Flight)
            .set({
                validation: {
                    state: state,
                    school: {
                        id: schoolId
                    },
                    instructor: {
                        id: instructorId
                    },
                    timestamp: new Date()
                }
            })
            .where("user_id = :userId", { userId: token.userId })
            .andWhere("validation_state IS NULL")
            .execute();
    }
}
