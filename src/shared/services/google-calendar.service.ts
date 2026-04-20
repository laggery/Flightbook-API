import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { School } from '../../training/school/domain/school.entity';
import { Appointment } from '../../training/appointment/appointment.entity';
import { I18nContext } from 'nestjs-i18n';
import * as moment from 'moment';

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
      scope: ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly'],
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

      return response.data.items
        ?.filter(cal => cal.accessRole === 'owner' || cal.accessRole === 'writer')
        .map(cal => ({
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

    // Build description with all fields
    const descriptionParts: string[] = [];

    // Status
    const statusLabel = i18n.t('translation.appointment.state', { lang: appointment.school.language });
    descriptionParts.push(`<b>${statusLabel}:</b> ${translatedState}`);

    // Meeting Point with date/time
    const meetingPointLabel = i18n.t('translation.appointment.meetingPoint', { lang: appointment.school.language });
    const formattedDateTime = moment.utc(startDateTime).format('DD.MM.YYYY HH:mm');
    descriptionParts.push(`<b>${meetingPointLabel}:</b> ${formattedDateTime} ${appointment.meetingPoint || ''}`);

    // Max People
    if (appointment.maxPeople) {
      const maxPeopleLabel = i18n.t('translation.appointment.maxPeople', { lang: appointment.school.language });
      descriptionParts.push(`<b>${maxPeopleLabel}:</b> ${appointment.maxPeople}`);
    }

    // Instructor
    if (appointment.instructor) {
      const instructorLabel = i18n.t('translation.appointment.instructor', { lang: appointment.school.language });
      const instructorName = `${appointment.instructor.firstname} ${appointment.instructor.lastname}`;
      descriptionParts.push(`<b>${instructorLabel}:</b> ${instructorName}`);
    }

    // Take Off Coordinator
    if (appointment.takeOffCoordinatorText) {
      const takeOffCoordinatorLabel = i18n.t('translation.appointment.takeOffCoordinator', { lang: appointment.school.language });
      descriptionParts.push(`<b>${takeOffCoordinatorLabel}:</b> ${appointment.takeOffCoordinatorText}`);
    }

    // Description
    if (appointment.description) {
      const descriptionLabel = i18n.t('translation.appointment.description', { lang: appointment.school.language });
      descriptionParts.push(`<b>${descriptionLabel}:</b> ${appointment.description}`);
    }

    const description = descriptionParts.join('<br>');

    // Determine color from appointment type
    const colorId = appointment.type?.color
      ? this.mapColorToGoogleCalendarId(appointment.type.color)
      : '9'; // Default Blueberry

    return {
      summary: appointment.type ? `${appointment.type.name} / ${translatedState}` : `Flightbook Appointment / ${translatedState}`,
      location: appointment.meetingPoint || '',
      description: description,
      // Full day event
      colorId: colorId,
      start: {
        date: moment(startDateTime).format('YYYY-MM-DD'),
        timeZone: 'Europe/Zurich'
      },
      end: {
        date: moment(endDateTime).format('YYYY-MM-DD'),
        timeZone: 'Europe/Zurich'
      },
      // For time-based events, use:
      // start: {
      //   dateTime: startDateTime.toISOString(),
      //   timeZone: 'Europe/Zurich'
      // },
      // end: {
      //   dateTime: endDateTime.toISOString(),
      //   timeZone: 'Europe/Zurich'
      // },
      guestsCanModify: false,
      guestsCanInviteOthers: false,
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

  // Add this helper method to map custom colors to Google Calendar color IDs
  private mapColorToGoogleCalendarId(color: string): string {
    // Google Calendar color palette with their RGB values
    const googleColors: { id: string; rgb: [number, number, number] }[] = [
      { id: '1', rgb: [164, 189, 252] }, // Lavender
      { id: '2', rgb: [122, 231, 191] }, // Sage
      { id: '3', rgb: [219, 173, 255] }, // Grape
      { id: '4', rgb: [255, 136, 124] }, // Flamingo
      { id: '5', rgb: [251, 215, 91] },  // Banana
      { id: '6', rgb: [255, 184, 120] }, // Tangerine
      { id: '7', rgb: [70, 214, 219] },  // Peacock
      { id: '8', rgb: [225, 225, 225] }, // Graphite
      { id: '9', rgb: [84, 132, 237] },  // Blueberry
      { id: '10', rgb: [81, 183, 73] },  // Basil
      { id: '11', rgb: [220, 33, 39] },  // Tomato
    ];

    // Parse the input color (supports hex, rgb, rgba)
    const rgb = this.parseColor(color);
    if (!rgb) {
      return '9'; // Default to Blueberry
    }

    // Find the closest color using Euclidean distance
    let closestId = '9';
    let minDistance = Infinity;

    for (const googleColor of googleColors) {
      const distance = Math.sqrt(
        Math.pow(rgb[0] - googleColor.rgb[0], 2) +
        Math.pow(rgb[1] - googleColor.rgb[1], 2) +
        Math.pow(rgb[2] - googleColor.rgb[2], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestId = googleColor.id;
      }
    }

    return closestId;
  }

  private parseColor(color: string): [number, number, number] | null {
    if (!color) return null;

    // Handle hex format (#rrggbb or #rgb)
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16),
        ];
      } else if (hex.length === 6) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];
      }
    }

    // Handle rgb/rgba format: rgb(r, g, b) or rgba(r, g, b, a)
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
      return [
        parseInt(rgbMatch[1]),
        parseInt(rgbMatch[2]),
        parseInt(rgbMatch[3]),
      ];
    }

    return null;
  }
}
