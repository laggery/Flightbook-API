import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { School } from '../../training/school/domain/school.entity';
import { Appointment } from '../../training/appointment/appointment.entity';
import { I18nContext } from 'nestjs-i18n';

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
}

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly apiUrl: string;

  constructor(
    private configService: ConfigService
  ) {
    this.clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.apiUrl = this.configService.get<string>('API_URL');
  }

  getAuthUrl(schoolId: number): string {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      `${this.apiUrl}/schools/google-calendar/callback`
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      state: JSON.stringify({ schoolId }),
      prompt: 'consent'
    });

    return authUrl;
  }

  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      `${this.apiUrl}/schools/google-calendar/callback`
    );

    try {
      const { tokens } = await oauth2Client.getToken(code);
      
      if (!tokens.access_token || !tokens.refresh_token) {
        throw new Error('Failed to obtain access or refresh token');
      }

      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: new Date(tokens.expiry_date || Date.now() + 3600000)
      };
    } catch (error) {
      this.logger.error(`Failed to exchange code for tokens:`, error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      return {
        accessToken: credentials.access_token,
        refreshToken: refreshToken,
        tokenExpiry: new Date(credentials.expiry_date || Date.now() + 3600000)
      };
    } catch (error) {
      this.logger.error(`Failed to refresh access token:`, error);
      throw error;
    }
  }

  async createEvent(appointment: Appointment, school: School): Promise<string> {
    if (!school.configuration?.googleCalendar) {
      this.logger.debug(`Google Calendar not configured for school ${school.id}, skipping event creation`);
      return null;
    }

    try {
      const authClient = await this.getAuthClient(school);
      const calendar = google.calendar({ version: 'v3', auth: authClient });

      const event = this.formatAppointmentAsEvent(appointment);

      const response = await calendar.events.insert({
        calendarId: school.configuration.googleCalendar.calendarId,
        requestBody: event
      });

      this.logger.debug(`Created Google Calendar event ${response.data.id} for appointment ${appointment.id}`);
      return response.data.id;
    } catch (error) {
      this.logger.error(`Failed to create Google Calendar event for appointment ${appointment.id}:`, error);
      return null;
    }
  }

  async updateEvent(appointment: Appointment, school: School): Promise<void> {
    if (!school.configuration?.googleCalendar || !appointment.googleCalendarEventId) {
      this.logger.debug(`Google Calendar not configured or no event ID for appointment ${appointment.id}, skipping update`);
      return;
    }

    try {
      const authClient = await this.getAuthClient(school);
      const calendar = google.calendar({ version: 'v3', auth: authClient });

      const event = this.formatAppointmentAsEvent(appointment);

      await calendar.events.update({
        calendarId: school.configuration.googleCalendar.calendarId,
        eventId: appointment.googleCalendarEventId,
        requestBody: event
      });

      this.logger.debug(`Updated Google Calendar event ${appointment.googleCalendarEventId} for appointment ${appointment.id}`);
    } catch (error) {
      this.logger.error(`Failed to update Google Calendar event for appointment ${appointment.id}:`, error);
    }
  }

  async deleteEvent(appointment: Appointment, school: School): Promise<void> {
    if (!school.configuration?.googleCalendar || !appointment.googleCalendarEventId) {
      this.logger.debug(`Google Calendar not configured or no event ID for appointment ${appointment.id}, skipping deletion`);
      return;
    }

    try {
      const authClient = await this.getAuthClient(school);
      const calendar = google.calendar({ version: 'v3', auth: authClient });

      await calendar.events.delete({
        calendarId: school.configuration.googleCalendar.calendarId,
        eventId: appointment.googleCalendarEventId
      });

      this.logger.debug(`Deleted Google Calendar event ${appointment.googleCalendarEventId} for appointment ${appointment.id}`);
    } catch (error) {
      this.logger.error(`Failed to delete Google Calendar event for appointment ${appointment.id}:`, error);
    }
  }

  async getAvailableCalendars(school: School): Promise<Array<{ id: string; summary: string; primary: boolean }>> {
    if (!school.configuration?.googleCalendar) {
      throw new Error('Google Calendar not configured for this school');
    }

    try {
      const authClient = await this.getAuthClient(school);
      const calendar = google.calendar({ version: 'v3', auth: authClient });

      const response = await calendar.calendarList.list();
      
      return response.data.items?.map(cal => ({
        id: cal.id || '',
        summary: cal.summary || '',
        primary: cal.primary || false
      })) || [];
    } catch (error) {
      this.logger.error(`Failed to fetch calendars for school ${school.id}:`, error);
      throw error;
    }
  }


  private async getAuthClient(school: School): Promise<Auth.OAuth2Client> {
    if (!school.configuration?.googleCalendar) {
      throw new Error('Google Calendar not configured for this school');
    }

    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret
    );

    oauth2Client.setCredentials({
      access_token: school.configuration.googleCalendar.accessToken,
      refresh_token: school.configuration.googleCalendar.refreshToken
    });

    return oauth2Client;
  }

  private formatAppointmentAsEvent(appointment: Appointment): any {
    const i18n = I18nContext.current();

    const startDateTime = new Date(appointment.scheduling);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

    const translatedState = i18n.t(`translation.appointment.stateValue.${appointment.state as any}`, { lang: appointment.school.language });

    return {
      summary: appointment.type? `${appointment.type.name} / ${translatedState}` : `Flightbook Appointment / ${translatedState}`,
      location: appointment.meetingPoint || '',
      description: appointment.description || '',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Zurich'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Zurich'
      }
    };
  }

  isTokenExpired(tokenExpiry: Date): boolean {
    if (!tokenExpiry) {
      return true;
    }

    const expiryDate = new Date(tokenExpiry);
    const now = new Date();
    const bufferTime = 5 * 60 * 1000;

    return expiryDate.getTime() - now.getTime() < bufferTime;
  }
}
