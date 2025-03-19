import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakConfig {
  private readonly baseUrl: string;
  private readonly realm: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly adminUsername: string;
  private readonly adminPassword: string;

  constructor(private configService: ConfigService) {
    // Fix for the URL format in case there's a typo in the environment variable
    const rawBaseUrl = this.configService.get<string>('KEYCLOAK_BASE_URL') || '';
    this.baseUrl = rawBaseUrl.startsWith('http') 
      ? rawBaseUrl 
      : `http://${rawBaseUrl}`;
      
    this.realm = this.configService.get<string>('KEYCLOAK_REALM') || 'flightbook';
    this.clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID') || 'flightbook-api';
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '';
    this.adminUsername = this.configService.get<string>('KEYCLOAK_ADMIN_USERNAME') || 'admin';
    this.adminPassword = this.configService.get<string>('KEYCLOAK_ADMIN_PASSWORD') || 'admin';
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getRealm(): string {
    return this.realm;
  }

  getClientId(): string {
    return this.clientId;
  }

  getClientSecret(): string {
    return this.clientSecret;
  }

  getAdminUsername(): string {
    return this.adminUsername;
  }

  getAdminPassword(): string {
    return this.adminPassword;
  }

  getTokenUrl(): string {
    return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`;
  }

  getLogoutUrl(): string {
    return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/logout`;
  }

  getUserInfoUrl(): string {
    return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`;
  }

  getCertsUrl(): string {
    return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/certs`;
  }
}
