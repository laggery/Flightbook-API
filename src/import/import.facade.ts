import { Inject, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { Flight } from '../flight/flight.entity';
import { Glider } from '../glider/glider.entity';
import { GliderRepository } from '../glider/glider.repository';
import { Place } from '../place/place.entity';
import { Readable } from 'stream';
import { ImportResultDto, ResultDto } from './interface/import-result-dto';
import { PlaceRepository } from '../place/place.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import moment = require('moment');
import { ImportException } from './exception/import.exception';
import { ImportType } from './import-type';
import { I18nService } from 'nestjs-i18n';
import { ImportTypeDto } from './interface/import-type-dto';
import { read, utils } from 'xlsx';

@Injectable()
export class ImportFacade {
    private UNKNOWN = "Unknown";

    constructor(
        private gliderRepository: GliderRepository,
        private placeRepository: PlaceRepository,
        private userRepository: UserRepository,
        @InjectEntityManager()
        private entityManager: EntityManager,
        @Inject(I18nService)
        private readonly i18n: I18nService
    ) { }

    getImportTypes(lang: string): ImportTypeDto[] {

        const types = [];
        for (const value in ImportType) {
            if (value === "CUSTOM") {
                continue;
            }

            const importTypeDto = new ImportTypeDto();
            importTypeDto.type = ImportType[value];
            importTypeDto.name = this.i18n.t(`translation.import.${ImportType[value]}.name`, { lang });
            importTypeDto.fileType = this.i18n.t(`translation.import.${ImportType[value]}.fileType`, { lang });
            const descriptionTranslationKey = `translation.import.${ImportType[value]}.description`
            const description: string = this.i18n.t(descriptionTranslationKey, { lang });

            if (description !== descriptionTranslationKey) {
                importTypeDto.description = description;
            }
            types.push(importTypeDto);
        }
        return types;
    }

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

    async importCustom(file: Express.Multer.File, userId: number): Promise<ImportResultDto> {
        const records = [];
        // Pipe the stream into the csv parser
        const parser = parse(file.buffer.toString(), {
            delimiter: ',',
            trim: true,
            skipEmptyLines: true
        });

        // Parse the CSV file
        for await (const record of parser) {
            records.push(record);
        }

        const gliders = [];
        const places = [];
        const flights = [];

        const user = await this.userRepository.getUserById(userId);

        records.forEach((record) => {
            // Extract glider
            let [brand, ...nameParts] = record[1].split(' ');
            let name = nameParts.join(' ');

            let glider = new Glider();
            glider.brand = brand;
            glider.name = name;
            glider.user = user;

            // Extract place
            let startAltitude = record[4];
            let startName = record[2];
            let landingName = record[3];
            let landingAltitude = record[5];

            let start = new Place();
            start.name = startName;
            start.altitude = +startAltitude;
            start.user = user;

            let landing = new Place();
            landing.name = landingName;
            landing.altitude = +landingAltitude;
            landing.user = user;

            // Extract flight
            let flight = new Flight();
            flight.date = record[0];
            if (record[6] != "") {
                let time = record[6];
                flight.time = new Date(time * 60 * 1000).toISOString().substring(11, 19);
            }

            if (record[7] != "") {
                flight.km = record[7];
            }

            if (record[8] != "") {
                flight.description = record[8];
            }
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

    async importVfr(file: Express.Multer.File, userId: number): Promise<ImportResultDto> {
        const workbook = read(file.buffer, {type: 'buffer'});
        var worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw_data = utils.sheet_to_json(worksheet, {header: 1});

        // remove header
        if (raw_data.length > 0) {
            raw_data.shift();
        }

        const gliders = [];
        const places = [];
        const flights = [];

        const user = await this.userRepository.getUserById(userId);

        raw_data.forEach((record: any[]) => {
            if (record.length < 1) {
                return
            }
            // Extract glider
            let glider = new Glider();
            glider.brand = "Unknown";
            glider.name = record[1].trim();
            glider.user = user;

            // Extract place
            let start = new Place();
            if (record[3]) {
                start.name = record[3].trim();
                start.user = user;
            }

            let landing = new Place();
            if (record[4]) {
                landing.name = record[4].trim();
                landing.user = user;
            }

            // Extract flight
            let flight = new Flight();
            flight.date = record[0];


            // Calculate time
            if (record[6] && record[7]) {
                const startTime = moment.duration(record[6]).asMilliseconds();
                const endTime = moment.duration(record[7]).asMilliseconds();
                const diff = endTime - startTime;
                const formattedTime = moment.utc(diff).format('HH:mm');
                flight.time = formattedTime;
            }

            if (record[12]) {
                flight.description = record[12];
            }

            flight.user = user;

            // Add gliders to set
            let resGlider = gliders.find((glider: Glider) => glider.brand.toLowerCase() === this.UNKNOWN.toLowerCase() && glider.name.toLowerCase() === record[1].toLowerCase());
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

    async importLogfly(file: Express.Multer.File, userId: number): Promise<ImportResultDto> {
        const importResultDto = new ImportResultDto();
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const places: Place[] = [];
        const gliders: Glider[] = [];
        const flights: Flight[] = [];

        const csvContent = file.buffer.toString();
        const rows = csvContent.split('\n').map(row => row.trim()).filter(row => row);
        const headers = rows[0].split(';');

        const parseValue = (value: string) => {
            const cleaned = value.trim();
            return cleaned === 'null' || cleaned === '...' ? null : cleaned;
        };

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row) continue;

            // Parse the row considering potential unescaped semicolons
            const parts = [];
            let currentPart = '';
            let insideQuotes = false;
            let previousChar = '';

            for (let j = 0; j < row.length; j++) {
                const char = row[j];

                if (char === '"' && previousChar !== '\\') {
                    insideQuotes = !insideQuotes;
                } else if (char === ';' && !insideQuotes) {
                    parts.push(parseValue(currentPart));
                    currentPart = '';
                } else {
                    currentPart += char;
                }

                previousChar = char;
            }
            // Push the last part
            if (currentPart) {
                parts.push(parseValue(currentPart));
            }

            // Validate we have the correct number of columns
            if (parts.length < 11) {
                console.warn(`Skipping row ${i + 1}: insufficient columns`);
                continue;
            }

            if (!parts[1] || !parts[10]) continue;  // Date and Voile are required

            // Process glider info - split by first space
            const [brand, ...nameParts] = parts[10].split(' ');
            const name = nameParts.join(' ');

            // Find or create glider and add it to flight
            const flight = new Flight();
            flight.user = user;

            let newGlider = gliders.find(g => g.brand.toLowerCase() === brand.toLowerCase() && g.name.toLowerCase() === name.toLowerCase());
            if (newGlider) {
                flight.glider = newGlider;
            } else {
                newGlider = new Glider();
                newGlider.brand = brand;
                newGlider.name = name;
                newGlider.user = user;
                flight.glider = newGlider;
                gliders.push(newGlider);
            }

            // Process place
            const site = parts[5];
            let place = places.find(p => p.name === site);
            if (place) {
                flight.start = place;
            } else if (site) {
                let newPlace = new Place();
                newPlace.user = user;
                newPlace.name = site;
                newPlace.altitude = parts[7] ? parseInt(parts[7]) : null;
                
                // Handle coordinates - clean up any quotes
                const lat = parts[8]?.replace(/['"]/g, '');
                const lon = parts[9]?.replace(/['"]/g, '');
                if (lat && lon) {
                    // newPlace.point = {
                    //     type: 'Point',
                    //     coordinates: [parseFloat(lon), parseFloat(lat)]
                    // };

                    let sqlResults = await this.placeRepository.convertEpsg4326toEpsg3857([lon, lat]);
                    // let sqlResults = await this.placeRepository.convertEpsg4326toEpsg3857(["7.48", "46.334"]);
                    newPlace.point = {
                        type: "Point",
                        coordinates: JSON.parse(sqlResults[0].st_asgeojson).coordinates
                    }
                }
                flight.start = newPlace;
                places.push(newPlace);
            }

            // Process duration
            if (parts[4]) {
                const durationMatch = parts[4].match(/(\d+)h(\d+)mn/);
                if (durationMatch) {
                    const hours = parseInt(durationMatch[1]);
                    const minutes = parseInt(durationMatch[2]);
                    flight.time = moment().hours(hours).minutes(minutes).format('HH:mm');
                }
            }

            // Set flight date and description
            flight.date = moment(parts[1].trim(), 'YYYY-MM-DD').format('YYYY-MM-DD');
            if (parts[11]) {
                flight.description = parts[11];  
            }
            
            flights.push(flight);
        }

        // Save data in transaction
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const gliderRepository = transactionalEntityManager.getRepository(Glider);
                const placeRepository = transactionalEntityManager.getRepository(Place);
                const flightRepository = transactionalEntityManager.getRepository(Flight);
                
                importResultDto.glider = await this.saveGliders(gliders, user, gliderRepository);
                importResultDto.place = await this.savePlaces(places, user, placeRepository);
                importResultDto.flight = await this.saveFlights(flights, user, flightRepository);
            });
        } catch (error) {
            console.log(error);
            throw ImportException.importFailedException();
        }

        return importResultDto;
    }

    async importFbPlaces(file: Express.Multer.File, userId: number): Promise<ImportResultDto> {
        const records = [];
        let first = true;

        // Pipe the stream into the csv parser
        const parser = parse(file.buffer.toString(), {
            delimiter: ',',
            trim: true,
            skipEmptyLines: true
        });

        const places = [];
        const user = await this.userRepository.getUserById(userId);

        // Parse the CSV file
        for await (const record of parser) {
            if (first) {
                first = false;
                continue;
            }
            // Extract place
            let place = new Place();
            place.name = record[3];
            place.altitude = record[0] === "" ? null : +record[0];
            place.country = record[2];
            place.notes = record[4];
            if (record[1]) {
                let sqlResults = await this.placeRepository.convertEpsg4326toEpsg3857(JSON.parse(record[1]));
                place.point = {
                    type: "Point",
                    coordinates: JSON.parse(sqlResults[0].st_asgeojson).coordinates
                }
            }
            place.user = user;

            let resPlace = places.find((element: Place) => element.name.toLowerCase() === place.name.toLowerCase());
            if (!resPlace) {
                places.push(place);
            }
        }

        const importResultDto = new ImportResultDto();

        // Save data in transaction
        try {
            await this.entityManager.transaction(async transactionalEntityManager => {
                const placeRepository = transactionalEntityManager.getRepository(Place);
                importResultDto.place = await this.saveFbPlaces(places, user, placeRepository);
            })
        } catch (error) {
            console.log(error);
            throw ImportException.importFailedException();
        }
        return importResultDto
    }

    private async saveGliders(gliders: Glider[], user: User, gliderRepository: Repository<Glider>): Promise<ResultDto> {
        const resultDto = new ResultDto();

        for (let glider of gliders) {
            let foundGlider = await this.gliderRepository.getGliderByName({ userId: user.id }, glider.name);
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

    /**
     * If some places already exists, savePlaces only set new altitude if not already exists
     * Used to save flubuch places
     */
    private async savePlaces(places: Place[], user: User, placeRepository: Repository<Place>): Promise<ResultDto> {
        const resultDto = new ResultDto();

        for (let place of places) {
            let foundPlace = await this.placeRepository.getPlaceByNameCaseInsensitive({ userId: user.id }, place.name);
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

    /**
     * If some places already exists, saveFbPlaces override it.
     * Used to save place import
     */
    private async saveFbPlaces(places: Place[], user: User, placeRepository: Repository<Place>): Promise<ResultDto> {
        const resultDto = new ResultDto();

        for (let place of places) {
            let foundPlace = await this.placeRepository.getPlaceByNameCaseInsensitive({ userId: user.id }, place.name);
            if (foundPlace) {
                place.id = foundPlace.id;
                resultDto.updated++;
            } else {
                resultDto.inserted++;
            }
            place.id = (await placeRepository.save(place)).id;
        }
        return resultDto;
    }

    private async saveFlights(flights: Flight[], user: User, flightRepository: Repository<Flight>): Promise<ResultDto> {
        const resultDto = new ResultDto();

        for (let flight of flights) {
            await flightRepository.save(flight);
            resultDto.inserted++;
        }
        return resultDto;
    }
}
