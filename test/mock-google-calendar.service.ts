import { OAuthTokens } from '../src/shared/services/google-calendar.service';
import { School } from '../src/training/school/domain/school.entity';
import { Appointment } from '../src/training/appointment/appointment.entity';

export class MockGoogleCalendarService {
  getAuthUrl(schoolId: number): string {
    return `https://mock-google-auth-url.com?state=${schoolId}`;
  }

  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    return {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      tokenExpiry: new Date(Date.now() + 3600000)
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    return {
      accessToken: 'mock-new-access-token',
      refreshToken: refreshToken,
      tokenExpiry: new Date(Date.now() + 3600000)
    };
  }

  async createEvent(appointment: Appointment, school: School): Promise<string> {
    return 'mock-event-id-' + appointment.id;
  }

  async updateEvent(appointment: Appointment, school: School): Promise<void> {
    return;
  }

  async deleteEvent(appointment: Appointment, school: School): Promise<void> {
    return;
  }

  async getAvailableCalendars(school: School): Promise<Array<{ id: string; summary: string; primary: boolean }>> {
    return [
      {
        id: 'primary',
        summary: 'Primary Calendar',
        primary: true
      },
      {
        id: 'calendar-2',
        summary: 'Secondary Calendar',
        primary: false
      },
      {
        id: 'calendar-3',
        summary: 'Test Calendar',
        primary: false
      }
    ];
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
