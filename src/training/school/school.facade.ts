import { Injectable, Logger } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { User } from '../../user/domain/user.entity';
import { UserRepository } from '../../user/user.repository';
import { TeamMember } from '../team-member/team-member.entity';
import { SchoolDto } from './interface/school-dto';
import { School } from './domain/school.entity';
import { SchoolRepository } from './school.repository';
import {SchoolException} from "./exception/school.exception";
import { SchoolConfig, GoogleCalendarConfig } from './domain/school-config';
import { GoogleCalendarService, OAuthTokens } from '../../shared/services/google-calendar.service';

@Injectable()
export class SchoolFacade {
    private readonly logger = new Logger(SchoolFacade.name);

    constructor(
        private schoolRepository: SchoolRepository,
        private userRepository: UserRepository,
        private googleCalendarService: GoogleCalendarService) { }

    async createSchool(token: any, schoolDto: SchoolDto): Promise<SchoolDto> {
        // Check name, address1, plz, city, phone, email
        if (!schoolDto.name || !schoolDto.address1 || !schoolDto.plz || !schoolDto.city || !schoolDto.phone || !schoolDto.email || !schoolDto.language) {
            throw SchoolException.invalidException();
        }

        const user: User = await this.userRepository.getUserById(token.userId);
        const school: School = plainToInstance(School, schoolDto);
        school.id = null;
        school.address2 = schoolDto.address2 === '' ? null : schoolDto.address2;
        school.configuration = new SchoolConfig();
        school.configuration.schoolModule = { 
            active: true,
            validateFlights: true,
            userCanEditControlSheet: true
        };
        school.configuration.tandemModule = {
            active: false
        };

        // Check if name already existe for this user
        if (await this.schoolRepository.getSchoolByName(school.name)) {
            throw SchoolException.alreadyExistsException();
        }

        // Create default team
        const member = new TeamMember();
        member.admin = true;
        member.user = user;
        school.teamMembers = [member];

        const schoolResp: School = await this.schoolRepository.save(school);
        return plainToClass(SchoolDto, schoolResp);
    }

    async updateSchool(token: any, id: number, schoolDto: SchoolDto): Promise<SchoolDto> {
        // Check name, address1, plz, city, phone, email
        if (!schoolDto.name || !schoolDto.address1 || !schoolDto.plz || !schoolDto.city || !schoolDto.phone || !schoolDto.email) {
            throw SchoolException.invalidIdException();
        }

        // Check that user is admin from the school
        

        const school: School = await this.schoolRepository.getSchoolById(id);

        // Check if name already existe for this user
        if (school.name !== schoolDto.name && await this.schoolRepository.getSchoolByName(schoolDto.name)) {
            throw SchoolException.alreadyExistsException();
        }

        school.name = schoolDto.name;
        school.address1 = schoolDto.address1;
        school.address2 = schoolDto.address2;
        school.plz = schoolDto.plz;
        school.city = schoolDto.city;
        school.phone = schoolDto.phone;
        school.email = schoolDto.email;

        const schoolResp: School = await this.schoolRepository.save(school);
        return plainToClass(SchoolDto, schoolResp);
    }

    async updateSchoolConfiguration(id: number, schoolConfigurationDto: SchoolConfig) {
        const school: School = await this.schoolRepository.getSchoolById(id);

        // Check if school exists
        if (!school) {
            throw SchoolException.notFoundException();
        }

        school.mergeConfiguration(schoolConfigurationDto);

        const schoolResp: School = await this.schoolRepository.save(school);
        return plainToClass(SchoolDto, schoolResp);
    }

    async getSchoolById(id: number): Promise<SchoolDto | undefined> {
        const school: School = await this.schoolRepository.getSchoolById(id);
        return plainToClass(SchoolDto, school);
    }

    async getGoogleCalendarStatus(id: number): Promise<{ connected: boolean }> {
        const school: School = await this.schoolRepository.getSchoolById(id);
        
        if (!school) {
            throw SchoolException.notFoundException();
        }

        const connected = !!(school.configuration?.googleCalendar?.accessToken && school.configuration?.googleCalendar?.refreshToken);
        return { connected };
    }

    async disconnectGoogleCalendar(id: number): Promise<void> {
        const school: School = await this.schoolRepository.getSchoolById(id);
        
        if (!school) {
            throw SchoolException.notFoundException();
        }

        if (school.configuration) {
            school.configuration.googleCalendar = null;
            await this.schoolRepository.save(school);
        }
    }

    async handleGoogleCalendarOAuthCallback(code: string, schoolId: number): Promise<void> {
        const school: School = await this.schoolRepository.getSchoolById(schoolId);
        
        if (!school) {
            throw SchoolException.notFoundException();
        }

        try {
            const tokens: OAuthTokens = await this.googleCalendarService.exchangeCodeForTokens(code);
            
            if (!school.configuration) {
                school.configuration = { schoolModule: null, tandemModule: null };
            }

            const googleCalendarConfig: GoogleCalendarConfig = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                calendarId: 'primary',
                tokenExpiry: tokens.tokenExpiry
            };

            school.configuration.googleCalendar = googleCalendarConfig;
            await this.schoolRepository.save(school);

            this.logger.debug(`Google Calendar connected for school ${schoolId}`);
        } catch (error) {
            this.logger.error(`Failed to handle OAuth callback for school ${schoolId}:`, error);
            throw error;
        }
    }

    async refreshGoogleCalendarToken(schoolId: number): Promise<void> {
        const school: School = await this.schoolRepository.getSchoolById(schoolId);
        
        if (!school) {
            throw SchoolException.notFoundException();
        }

        if (!school.configuration?.googleCalendar) {
            throw SchoolException.googleCalendarNotConfiguredException();
        }

        try {
            const tokens: OAuthTokens = await this.googleCalendarService.refreshAccessToken(
                school.configuration.googleCalendar.refreshToken
            );
            
            school.configuration.googleCalendar.accessToken = tokens.accessToken;
            school.configuration.googleCalendar.tokenExpiry = tokens.tokenExpiry;
            
            await this.schoolRepository.save(school);
            
            this.logger.debug(`Access token refreshed for school ${schoolId}`);
        } catch (error) {
            this.logger.error(`Failed to refresh access token for school ${schoolId}:`, error);
            throw error;
        }
    }

    async getAvailableGoogleCalendars(schoolId: number): Promise<Array<{ id: string; summary: string; primary: boolean }>> {
        const school: School = await this.schoolRepository.getSchoolById(schoolId);
        
        if (!school) {
            throw SchoolException.notFoundException();
        }

        if (!school.configuration?.googleCalendar) {
            throw SchoolException.googleCalendarNotConfiguredException();
        }

        // Check if token needs refresh
        if (this.googleCalendarService.isTokenExpired(school.configuration.googleCalendar.tokenExpiry)) {
            await this.refreshGoogleCalendarToken(schoolId);
            // Reload school after token refresh
            const refreshedSchool = await this.schoolRepository.getSchoolById(schoolId);
            return this.googleCalendarService.getAvailableCalendars(refreshedSchool);
        }

        return this.googleCalendarService.getAvailableCalendars(school);
    }

    async updateGoogleCalendarId(schoolId: number, calendarId: string): Promise<void> {
        const school: School = await this.schoolRepository.getSchoolById(schoolId);
        
        if (!school) {
            throw SchoolException.notFoundException();
        }

        if (!school.configuration?.googleCalendar) {
            throw SchoolException.googleCalendarNotConfiguredException();
        }

        school.configuration.googleCalendar.calendarId = calendarId;
        await this.schoolRepository.save(school);
        this.logger.debug(`Calendar ID updated to ${calendarId} for school ${schoolId}`);
    }
}
