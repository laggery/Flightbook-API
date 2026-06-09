import { Injectable } from '@nestjs/common';
import { FlightRepository } from './flight.repository';
import { UserRepository } from '../user/user.repository';
import { FlightDto } from './interface/flight-dto';
import { Flight } from './domain/flight.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from '../user/domain/user.entity';
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
import { School } from '../training/school/domain/school.entity';
import { FlightValidation } from './flight-validation.entity';
import { SchoolException } from '../training/school/exception/school.exception';
import { FlightValidationDto } from './interface/flight-validation-dto';
import { FlightValidationState } from './flight-validation-state';
import { NotificationsService } from '../shared/services/notifications.service';
import { SchoolRepository } from '../training/school/school.repository';
import { TandemSchoolPaymentState } from './domain/tandem-school-payment-state';
import { TandemSchoolData } from './domain/tandem-school-data.entity';
import { TandemSchoolDataDto } from './interface/tandem-school-data-dto';

@Injectable()
export class FlightFacade {

    constructor(
        private flightRepository: FlightRepository,
        private placeFacade: PlaceFacade,
        private gliderFacade: GliderFacade,
        private userRepository: UserRepository,
        private fileUploadService: FileUploadService,
        private notificationsService: NotificationsService,
        private schoolRepository: SchoolRepository
    ) { }

    async getFlights(token: any, query: any): Promise<FlightDto[]> {
        const list: Flight[] = await this.flightRepository.getFlights(token, query);
        return plainToInstance(FlightDto, list);
    }

    async getFlightById(token: any, id: number): Promise<FlightDto> {
        const flight: Flight = await this.flightRepository.getFlightByIdWithRelations(token, id);
        return plainToInstance(FlightDto, flight);
    }

    async countNotValidatedFlights(token: any, isTandem: boolean): Promise<number> {
        return this.flightRepository.countNotValidatedFlights(token, isTandem);
    }

    async getFlightsPager(token: any, query: any): Promise<PagerEntityDto<FlightDto[]>> {
        const promiseList = [];
        promiseList.push(this.flightRepository.getFlightsPager(token, query));
        if (!query.limit) {
            query.limit = 100;
        }
        promiseList.push(this.flightRepository.getFlights(token, query));

        let response = await Promise.all(promiseList);
        const pagerDto = response[0] as PagerEntityDto<FlightDto[]>;
        pagerDto.entity = plainToInstance(FlightDto, response[1] as Flight[]);
        return pagerDto;
    }

    async getStatisticV1(token: any, query: any): Promise<FlightStatisticDto | FlightStatisticDto[]> {
        const statList: FlightStatisticDto[] = [];
        statList.push(await this.flightRepository.getGlobalStatistic(token, query));
        if (query.years && query.years === "1") {
            statList.push(...await this.flightRepository.getStatisticYears(token, query))
            return statList;
        }
    
        return statList[0];
    }

    async getStatisticV2(token: any, query: any): Promise<FlightStatisticDto[]> {
        if (!query.type || query.type == StatisticType.YEARLY) {
            return this.flightRepository.getStatisticYears(token, query);
        } else if (query.type == StatisticType.MONTHLY) {
            return this.flightRepository.getStatisticMonth(token, query);
        } else if (query.type == StatisticType.GLOBAL) {
            const list: FlightStatisticDto[] = []
            list.push(await this.flightRepository.getGlobalStatistic(token, query));
            return list;
        }
        return [];
    }

    async getGlobalStatistic(token: any, query: any): Promise<FlightStatisticDto> {
        return this.flightRepository.getGlobalStatistic(token, query);
    }

    async createFlight(token: any, flightDto: FlightDto): Promise<FlightDto> {
        const user: User = await this.userRepository.getUserById(token.userId);
        let flight: Flight = plainToClass(Flight, flightDto);

        flight = await this.flightValidityCheck(flightDto, flight, token);

        flight.id = null;
        flight.user = user;
        flight.validation = null;

        // Validate schoolCustomValues if provided
        if (flightDto.tandemSchoolData?.schoolCustomValues && flightDto.tandemSchoolData.schoolCustomValues.length > 0) {
            if (!flightDto.tandemSchoolData?.tandemSchool?.id) {
                FlightException.customValuesWithoutSchoolException();
            }
        }

        if (flightDto.tandemSchoolData?.tandemSchool) {
            flight.tandemSchoolData.tandemSchool = await this.schoolRepository.getSchoolById(flightDto.tandemSchoolData.tandemSchool.id);
            
            // Validate custom values against school configuration
            if (flightDto.tandemSchoolData?.schoolCustomValues) {
                this.validateCustomValues(
                    flightDto.tandemSchoolData.schoolCustomValues,
                    flight.tandemSchoolData.tandemSchool
                );
            }
            
            // In Case of duplicate flight, the payment data is not duplicated
            flight.tandemSchoolData.paymentComment = null;
            flight.tandemSchoolData.paymentState = null;
            flight.tandemSchoolData.paymentTimestamp = null;
            flight.tandemSchoolData.instructor = null;
        }

        const flightResp: Flight = await this.flightRepository.save(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async updateFlight(token: any, id: number, flightDto: FlightDto): Promise<FlightDto> {
        let flight: Flight = await this.flightRepository.getFlightById(token, id);

        if (!flight) {
            FlightException.notFoundException();
        }

        if (flight.tandemSchoolData?.paymentState == TandemSchoolPaymentState.PAID) {
            FlightException.cannotChangePaidFlightException();
        }

        flight = await this.flightValidityCheck(flightDto, flight, token);

        flight.time = flightDto.time;
        flight.km = flightDto.km;
        flight.description = flightDto.description;
        flight.price = flightDto.price;
        flight.igc = flightDto.igc;
        flight.shvAlone = flightDto.shvAlone;

        if (flight.validation) {
            flight.validation.state = null;
        }

        // Validate schoolCustomValues if provided
        if (flightDto.tandemSchoolData?.schoolCustomValues && flightDto.tandemSchoolData.schoolCustomValues.length > 0) {
            if (!flightDto.tandemSchoolData?.tandemSchool?.id && !flight.tandemSchoolData?.tandemSchool?.id) {
                FlightException.customValuesWithoutSchoolException();
            }
        }

        // Handle tandemSchool update or removal
        if (flightDto.tandemSchoolData?.tandemSchool) {
            flight.tandemSchoolData.tandemSchool = await this.schoolRepository.getSchoolById(flightDto.tandemSchoolData.tandemSchool.id);
        } else if (flightDto.tandemSchoolData && flightDto.tandemSchoolData.tandemSchool === null) {
            // Explicitly clear tandemSchool when set to null
            flight.tandemSchoolData.tandemSchool = null;
        }

        // Handle schoolCustomValues update or removal
        if (flightDto.tandemSchoolData?.schoolCustomValues && flight.tandemSchoolData?.tandemSchool) {
            this.validateCustomValues(
                flightDto.tandemSchoolData.schoolCustomValues,
                flight.tandemSchoolData.tandemSchool
            );
            // Assign validated custom values to flight
            flight.tandemSchoolData.schoolCustomValues = flightDto.tandemSchoolData.schoolCustomValues;
        } else if (flightDto.tandemSchoolData && Array.isArray(flightDto.tandemSchoolData.schoolCustomValues) && flightDto.tandemSchoolData.schoolCustomValues.length === 0) {
            // Explicitly clear schoolCustomValues when set to empty array
            flight.tandemSchoolData.schoolCustomValues = [];
        }

        const flightResp: Flight = await this.flightRepository.save(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async updateFlightAlone(token: any, id: number, flightDto: FlightDto): Promise<FlightDto> {
        let flight: Flight = await this.flightRepository.getFlightById(token, id);

        if (!flight) {
            FlightException.notFoundException();
        }

        flight.shvAlone = flightDto.shvAlone === undefined ? false : flightDto.shvAlone;

        const flightResp: Flight = await this.flightRepository.save(flight);
        return plainToClass(FlightDto, flightResp);
    }

    async validateFlight(token: any, id: number, school: School, instructorId: number, flightValidationDto: FlightValidationDto): Promise<FlightDto> {
        let flight: Flight = await this.flightRepository.getFlightByIdWithRelations(token, id);

        if (!flight) {
            FlightException.notFoundException();
        }

        const instructor: User = await this.userRepository.getUserById(instructorId);
        if (!instructor) {
            SchoolException.instructorNotFoundException();
        }

        const flightValidation: FlightValidation = new FlightValidation();
        flightValidation.instructor = instructor;
        flightValidation.school = school;
        flightValidation.timestamp = new Date();
        flightValidation.state = flightValidationDto.state;
        flightValidation.comment = flightValidationDto.comment;
        flight.validation = flightValidation;

        const flightResp: Flight = await this.flightRepository.save(flight);
        if (flightResp.validation.state === FlightValidationState.REJECTED) {
            this.notificationsService.sendFlightValidationRejected(flightResp);
        }
        return plainToClass(FlightDto, flightResp);
    }

    async validateAllFlight(token: any, school: School, instructorId: number, flightValidationDto: FlightValidationDto) {
        const instructor: User = await this.userRepository.getUserById(instructorId);
        if (!instructor) {
            SchoolException.instructorNotFoundException();
        }

        await this.flightRepository.validateAllFlight(token, school.id, instructorId, flightValidationDto.state);
    }

    async removeFlight(token: any, id: number): Promise<FlightDto> {
        const flight: Flight = await this.flightRepository.getFlightById(token, id);
        const flightResp: Flight = await this.flightRepository.remove(flight);
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

        // Check if tandem school exist
        if (flight.tandemSchoolData?.tandemSchool?.id) {
            const school: School = await this.schoolRepository.getSchoolById(flight.tandemSchoolData.tandemSchool.id);
            flight.tandemSchoolData.tandemSchool = school;
        }

        return flight;
    }

    async nbFlightsByPlaceId(token: any, placeId: number) {
        return this.flightRepository.countFlightsByPlaceId(token, placeId);
    }

    async nbFlightsByGliderId(token: any, gliderId: number) {
        return this.flightRepository.countFlightsByGliderId(token, gliderId);
    }

    // Tandem methods
    async updateFlightPayment(token: any, id: number, school: School, instructorId: number, tandemSchoolDataDto: TandemSchoolDataDto): Promise<FlightDto> {
        let flight: Flight = await this.flightRepository.getFlightByIdWithRelations(token, id);

        if (!flight) {
            FlightException.notFoundException();
        }

        const instructor: User = await this.userRepository.getUserById(instructorId);
        if (!instructor) {
            SchoolException.instructorNotFoundException();
        }

        const tandemSchoolData: TandemSchoolData = new TandemSchoolData();
        tandemSchoolData.instructor = instructor;
        tandemSchoolData.tandemSchool = school;
        tandemSchoolData.paymentTimestamp = new Date();
        tandemSchoolData.paymentState = tandemSchoolDataDto.paymentState;
        tandemSchoolData.paymentComment = tandemSchoolDataDto?.paymentComment == '' ? null : tandemSchoolDataDto.paymentComment;
        tandemSchoolData.paymentAmount = tandemSchoolDataDto?.paymentAmount == undefined ? null : tandemSchoolDataDto.paymentAmount;
        // Preserve existing schoolCustomValues - school endpoint cannot modify custom values
        tandemSchoolData.schoolCustomValues = flight.tandemSchoolData?.schoolCustomValues || null;
        flight.tandemSchoolData = tandemSchoolData;

        const flightResp: Flight = await this.flightRepository.save(flight);
        if (flightResp.tandemSchoolData.paymentState === TandemSchoolPaymentState.REJECTED) {
            this.notificationsService.sendFlightPaymentRejected(flightResp);
        }
        return plainToClass(FlightDto, flightResp);
    }

    private validateCustomValues(customValues: any[], school: School): void {
        const flightConfig = school.configuration?.tandemModule?.flightConfig;
        
        if (!flightConfig || !flightConfig.customFields || flightConfig.customFields.length === 0) {
            // School has no custom fields configured, reject any custom values
            if (customValues && customValues.length > 0) {
                FlightException.invalidCustomFieldKeyException(customValues[0].key);
            }
            return;
        }

        const fieldDefinitions = flightConfig.customFields;
        const activeFields = fieldDefinitions.filter(f => !f.disabled);
        
        // Check all provided values have valid keys
        for (const customValue of customValues) {
            const fieldDef = fieldDefinitions.find(f => f.key === customValue.key);
            
            if (!fieldDef) {
                FlightException.invalidCustomFieldKeyException(customValue.key);
            }
            
            // Only validate active fields
            if (!fieldDef.disabled) {
                // Type validation
                this.validateCustomValueType(customValue, fieldDef);
                
                // Dropdown options validation
                if (fieldDef.type === 'dropdown' && fieldDef.options) {
                    if (!fieldDef.options.includes(customValue.value)) {
                        FlightException.invalidDropdownValueException(customValue.key, customValue.value, fieldDef.options);
                    }
                }
            }
        }
        
        // Check all required active fields are provided
        const providedKeys = customValues.map(cv => cv.key);
        for (const fieldDef of activeFields) {
            if (fieldDef.required && !providedKeys.includes(fieldDef.key)) {
                FlightException.requiredCustomFieldMissingException(fieldDef.key);
            }
        }
    }

    private validateCustomValueType(customValue: any, fieldDef: any): void {
        const value = customValue.value;
        const type = fieldDef.type;
        
        switch (type) {
            case 'text':
            case 'dropdown':
                if (typeof value !== 'string') {
                    FlightException.invalidCustomFieldTypeException(fieldDef.key, type, value);
                }
                break;
            case 'number':
                if (typeof value !== 'number') {
                    FlightException.invalidCustomFieldTypeException(fieldDef.key, type, value);
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean') {
                    FlightException.invalidCustomFieldTypeException(fieldDef.key, type, value);
                }
                break;
            case 'date':
                // Accept string dates (ISO format)
                if (typeof value !== 'string' || isNaN(Date.parse(value))) {
                    FlightException.invalidCustomFieldTypeException(fieldDef.key, type, value);
                }
                break;
        }
    }

}
