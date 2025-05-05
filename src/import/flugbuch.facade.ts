import { Injectable } from '@nestjs/common';
import { Flight } from '../flight/flight.entity';
import { Glider } from '../glider/glider.entity';
import { GliderRepository } from '../glider/glider.repository';
import { Place } from '../place/place.entity';
import { ImportResultDto, ResultDto } from './interface/import-result-dto';
import { PlaceRepository } from '../place/place.repository';
import { UserRepository } from '../user/user.repository';
import { User } from '../user/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import moment = require('moment');
import { ImportException } from './exception/import.exception';
import { ImportType } from './import-type';
import { UnprocessableEntityException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class FlugbuchFacade {
    private readonly logger = new Logger(FlugbuchFacade.name);

    constructor(
        private gliderRepository: GliderRepository,
        private placeRepository: PlaceRepository,
        private userRepository: UserRepository,
        @InjectEntityManager()
        private entityManager: EntityManager
    ) { }

    async importFlugbuch(file: Express.Multer.File, userId: number): Promise<ImportResultDto> {
        const records = [];
        
        try {
            // Get file content as string
            const fileContent = file.buffer.toString('utf8');
            
            // Split into lines and filter out empty lines
            const lines = fileContent.split('\n').filter(line => line.trim().length > 0);
            if (lines.length === 0) {
                throw ImportException.invalidCsvException(ImportType.FLUGBUCH, 0);
            }
            
            this.logger.debug("Number of lines:", lines.length);
            
            // Process each line
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                
                this.logger.debug(`Processing line ${i + 1}: ${line.substring(0, 50)}...`);
                
                // Remove trailing semicolon if present
                if (line.endsWith(';')) {
                    line = line.slice(0, -1);
                    this.logger.debug("Removed trailing semicolon");
                }
                
                // Parse the CSV line
                const parsedRecord = this.parseCSVLine(line);
                
                this.logger.debug(`Parsed ${parsedRecord.length} fields:`, parsedRecord.map(f => f.substring(0, 10) + (f.length > 10 ? '...' : '')));
                
                // Validate record
                if (parsedRecord.length !== 12) {
                    this.logger.error(`Line ${i + 1} has ${parsedRecord.length} fields instead of 12`);
                    throw ImportException.invalidCsvException(ImportType.FLUGBUCH, i + 1);
                }
                
                // Check if first field is a number (not a header)
                if (i === 0 && isNaN(+parsedRecord[0])) {
                    this.logger.error(`First field is not a number: ${parsedRecord[0]}`);
                    throw ImportException.invalidCsvException(ImportType.FLUGBUCH, i + 1);
                }
                
                // Clean up all fields - remove any trailing quotes
                const cleanedRecord = parsedRecord.map(field => {
                    // Skip empty fields
                    if (!field) return field;
                    
                    let cleanField = field;
                    
                    // Remove trailing quotes if present
                    while (cleanField.endsWith('"')) {
                        cleanField = cleanField.slice(0, -1);
                    }
                    
                    // Remove leading quotes if present
                    while (cleanField.startsWith('"')) {
                        cleanField = cleanField.slice(1);
                    }
                    
                    return cleanField;
                });
                
                records.push(cleanedRecord);
            }
            
            if (records.length === 0) {
                throw ImportException.invalidCsvException(ImportType.FLUGBUCH, 1);
            }
            
            this.logger.debug(`Successfully parsed ${records.length} records`);
        } catch (error) {
            this.logger.error('CSV parsing error:', error);
            if (error instanceof UnprocessableEntityException) {
                throw error; // Re-throw our custom exception
            } else {
                throw ImportException.importFailedException();
            }
        }

        // Process the records
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
            landing.altitude = +startAltitude - +diff; // Ensure both are converted to numbers
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
            this.logger.debug(error);
            throw ImportException.importFailedException();
        }

        return importResultDto;
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

    private async saveFlights(flights: Flight[], user: User, flightRepository: Repository<Flight>): Promise<ResultDto> {
        const resultDto = new ResultDto();

        for (let flight of flights) {
            await flightRepository.save(flight);
            resultDto.inserted++;
        }
        return resultDto;
    }

    /**
     * Parse a CSV line handling both formats:
     * Format 1: "1,""4.9.2021"",""08:00"",""0:10"",""Gradient BiGolden4"",""1914"",""Riederalp West"",""Bitsch"",""1213"",""4.733"",""Instruktionsflug, Lenken, Bremsstellungen, Landevolte"",""Raoul Geiger"""
     * Format 2: "1","26.8.2023","08:30","0:5","Brand Name","1230","Start","Landing","497","1.296","Description","Instructor Name"
     */
    private parseCSVLine(line: string): string[] {
        // Initialize variables for parsing
        const result: string[] = [];
        let currentField = '';
        let inQuotes = false;
        let doubleQuoteMode = false;
        
        // Check if we're dealing with the special format with "" escaping
        doubleQuoteMode = line.includes('""');
        
        // Remove outer quotes if they exist
        if (line.startsWith('"') && line.endsWith('"')) {
            line = line.slice(1, -1);
        }
        
        // For the special case of Format 1 with outer quotes and commas
        // "1,""4.9.2021"",""08:00"",...
        if (doubleQuoteMode) {
            this.logger.debug("Using Format 1 parser (double quotes)");
            
            // For Format 1, use a direct approach with specific field extraction
            // Split by ,"" which marks the beginning of each field (except the first)
            const parts = line.split(',""');
            
            if (parts.length >= 11) {  // We expect at least 11 parts for 12 fields
                // First field is just the number
                result.push(parts[0]);
                
                // For fields 1-9, they are straightforward
                for (let i = 1; i < 10; i++) {
                    // Remove trailing quotes if present
                    let field = parts[i];
                    if (field.endsWith('"')) {
                        field = field.slice(0, -1);
                    }
                    result.push(field);
                }
                
                // Field 10 is the description which might contain commas
                // Field 11 is the instructor name
                if (parts.length === 11) {
                    // If we have exactly 11 parts, the last part contains both description and instructor
                    // Split the last part by the last occurrence of ,""
                    const lastPart = parts[10];
                    const lastCommaIndex = lastPart.lastIndexOf(',""');
                    
                    if (lastCommaIndex !== -1) {
                        // Extract description and instructor
                        const description = lastPart.substring(0, lastCommaIndex);
                        const instructor = lastPart.substring(lastCommaIndex + 3, lastPart.length - 1);
                        
                        result.push(description);
                        result.push(instructor);
                    } else {
                        // Fallback: just split the last part in half
                        const midPoint = Math.floor(lastPart.length / 2);
                        result.push(lastPart.substring(0, midPoint));
                        result.push(lastPart.substring(midPoint));
                    }
                } else {
                    // If we have more than 11 parts, assume parts[10] to parts[length-2] form the description
                    // and parts[length-1] is the instructor
                    const description = parts.slice(10, parts.length - 1).join(',');
                    let instructor = parts[parts.length - 1];
                    
                    // Remove trailing quotes from instructor if present
                    if (instructor.endsWith('"')) {
                        instructor = instructor.slice(0, -1);
                    }
                    
                    result.push(description);
                    result.push(instructor);
                }
            } else {
                // Fallback to character-by-character parsing
                this.logger.debug("Falling back to character-by-character parsing for Format 1");
                
                // State variables
                let i = 0;
                let field = '';
                let insideQuotes = false;
                let fieldCount = 0;
                
                while (i < line.length) {
                    // Check for double quotes (escaped quotes)
                    if (line[i] === '"' && i + 1 < line.length && line[i + 1] === '"') {
                        field += '"'; // Add a single quote to the field
                        i += 2; // Skip both quotes
                    }
                    // Check for field delimiter (comma outside quotes)
                    else if (line[i] === ',' && !insideQuotes) {
                        result.push(field);
                        field = '';
                        fieldCount++;
                        i++;
                        
                        // Special handling for field 10 (description) which may contain commas
                        if (fieldCount === 10) {
                            // Find the last occurrence of ,"" which marks the beginning of field 11
                            const remainingText = line.substring(i);
                            const lastFieldIndex = remainingText.lastIndexOf(',""');
                            
                            if (lastFieldIndex !== -1) {
                                // Extract the description (field 10)
                                const description = remainingText.substring(0, lastFieldIndex);
                                result.push(description);
                                
                                // Extract the instructor (field 11)
                                const instructor = remainingText.substring(lastFieldIndex + 3);
                                // Remove trailing quotes if present
                                if (instructor.endsWith('"')) {
                                    result.push(instructor.slice(0, -1));
                                } else {
                                    result.push(instructor);
                                }
                                
                                // We've processed all fields
                                break;
                            }
                        }
                    }
                    // Check for quote (start or end of quoted content)
                    else if (line[i] === '"') {
                        insideQuotes = !insideQuotes;
                        i++;
                    }
                    // Regular character
                    else {
                        field += line[i];
                        i++;
                    }
                }
                
                // Add the last field if we haven't reached the special case
                if (fieldCount < 10 && field !== '') {
                    result.push(field);
                }
            }
        }
        // For Format 2 (standard CSV with "," delimiters)
        else if (line.includes('","')) {
            this.logger.debug("Using Format 2 parser (standard CSV)");
            
            // Split by "," and handle the quotes
            const parts = line.split('","');
            
            for (let i = 0; i < parts.length; i++) {
                let part = parts[i];
                
                // Clean up the first and last parts
                if (i === 0 && part.startsWith('"')) {
                    part = part.substring(1);
                }
                if (i === parts.length - 1 && part.endsWith('"')) {
                    part = part.substring(0, part.length - 1);
                }
                
                result.push(part);
            }
        }
        // Fallback to a character-by-character parser for any other format
        else {
            this.logger.debug("Using fallback parser");
            
            // Parse character by character
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(currentField);
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            
            // Add the last field
            if (currentField !== '') {
                result.push(currentField);
            }
        }
        
        return result;
    }
}
