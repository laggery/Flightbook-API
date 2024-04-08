import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { Flight } from '../flight/flight.entity';
import { Glider } from '../glider/glider.entity';
import { GliderRepository } from '../glider/glider.repository';
import { Place } from '../place/place.entity';
import { Readable } from 'stream';
import { ImportResultDto, ResultDto } from './interface/import-result-dto';
import { PlaceRepository } from '../place/place.repository';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import moment = require('moment');
import { ImportException } from './exception/import.exception';
import { ImportType } from './import-type';

@Injectable()
export class ImportFacade {

    constructor(
        private gliderRepository: GliderRepository,
        private placeRepository: PlaceRepository,
        private userRepository: UserService,
        @InjectEntityManager()
        private entityManager: EntityManager,
    ) { }

    async importFlugbuch(file: Express.Multer.File, userId: number): Promise<ImportResultDto> {
        const records = [];
        let first = true;
        let line = 1;

        // First we need to repair the csv file
        let lines = file.buffer.toString('utf8').split('\n');

        lines = lines.map(line => {
            line = line.replace(/","/g, "','")
            .slice(1)
            .slice(0, -1)
            .replace(/"/g, '""')
            .replace(/','/g, '","');

            return `"${line}"`;
        });

        const csv = lines.join('\r\n');

        // Convert the string to a stream
        const stream = new Readable();
        stream.push(csv);
        stream.push(null); // Indicates end of the stream

        // Pipe the stream into the csv parser
        const parser = stream.pipe(parse({
            delimiter: ',',
            trim: true,
            skipEmptyLines: true
        }));

        // Parse the CSV file
        for await (const record of parser) {
            if (first) {
                // First line should not have header
                if (isNaN(+record[0])) {
                    ImportException.invalidCsvException(ImportType.FLUGBUCH, line);
                }

                first = false;
            }

            // Check if record has 12 fields
            if (record.length !== 12) {
                ImportException.invalidCsvException(ImportType.FLUGBUCH, line);
            }

            line++;
            records.push(record);
        }

        // TODO check max records

        const gliders = [];
        const places = [];
        const flights = [];

        const user = await this.userRepository.getUserById(userId);

        records.forEach((record) => {
            // Extract glider
            let [brand, ...nameParts] = record[4].split(' ');
            let name = nameParts.join(' ');

            let glider = new Glider();
            glider.brand = brand;
            glider.name = name;
            glider.user = user;

            // Extract place
            let startAltitude = record[5];
            let startName = record[6];
            let landingName = record[7];
            let diff = record[8];

            let start = new Place();
            start.name = startName;
            start.altitude = +startAltitude;
            start.user = user;

            let landing = new Place();
            landing.name = landingName;
            landing.altitude = startAltitude - diff;
            landing.user = user;

            // Extract flight
            let flight = new Flight();
            flight.date = moment(record[1], 'D.M.YYYY').format('MM-DD-YYYY');
            flight.time = record[3];
            if (record[9] != "") {
                flight.km = record[9];
            }    
            flight.description = record[10];
            flight.user = user;

            // Add gliders to set
            let resGlider = gliders.find((glider: Glider) => glider.brand.toLowerCase() === brand.toLowerCase() && glider.name.toLowerCase() === name.toLowerCase());
            if (resGlider) {
                flight.glider = resGlider;
            } else {
                flight.glider = glider;
                gliders.push(glider);
            }

            // Add places to set
            if (start.name?.length > 0) {
                let resStart = places.find((place: Place) => place.name.toLowerCase() === start.name.toLowerCase());
                if (resStart) {
                    flight.start = resStart;
                } else {
                    flight.start = start;
                    places.push(start);
                }
            }

            if (landing.name?.length > 0) {
                let resLanding = places.find((place: Place) => place.name.toLowerCase() === landing.name.toLowerCase());
                if (resLanding) {
                    flight.landing = resLanding;
                } else {
                    flight.landing = landing;
                    places.push(landing);
                }
            }

            // Add flight to set
            flights.push(flight);
        });

        const importResultDto = new ImportResultDto();
        
        // Save data in transaction
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const gliderRepository = transactionalEntityManager.getRepository(Glider);
                const placeRepository = transactionalEntityManager.getRepository(Place);
                const flightRepository = transactionalEntityManager.getRepository(Flight);
                importResultDto.glider = await this.saveGliders(gliders, user, gliderRepository);
                importResultDto.place = await this.savePlaces(places, user, placeRepository);
                importResultDto.flight = await this.saveFlights(flights, user, flightRepository);
            })
        } catch (error) {
            console.log(error);
            throw ImportException.importFailedException();
        }

        return importResultDto;
    }

    private async saveGliders(gliders: Glider[], user: User, gliderRepository: Repository<Glider>): Promise<ResultDto> {
        const resultDto = new ResultDto();

        for(let glider of gliders) {
            let foundGlider = await this.gliderRepository.getGliderByName({userId: user.id}, glider.name);
            if (foundGlider) {
                glider.id = foundGlider.id;
                resultDto.existed++;
            } else {
                glider.id = (await gliderRepository.save(glider)).id;
                resultDto.inserted++;
            }
        }
        return resultDto;
    }

    private async savePlaces(places: Place[], user: User, placeRepository: Repository<Place>): Promise<ResultDto> {
        const resultDto = new ResultDto();

        for(let place of places) {
            let foundPlace = await this.placeRepository.getPlaceByNameCaseInsensitive({userId: user.id}, place.name);
            if (foundPlace) {
                if (!foundPlace.altitude) {
                    // update altitude
                    foundPlace.altitude = place.altitude;
                    place.id = (await placeRepository.save(foundPlace)).id;
                    resultDto.updated++;
                } else {
                    place.id = foundPlace.id;
                    resultDto.existed++;
                }    
            } else {
                place.id = (await placeRepository.save(place)).id;
                resultDto.inserted++;
            }
        }
        return resultDto;
    }

    private async saveFlights(flights: Flight[], user: User, flightRepository: Repository<Flight>): Promise<ResultDto> {
        const resultDto = new ResultDto();

        for(let flight of flights) {
            await flightRepository.save(flight);
            resultDto.inserted++;
        }
        return resultDto;
    }
}
