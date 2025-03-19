import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as querystring from 'querystring';
import { KeycloakConfig } from '../config/keycloak.config';
import { HttpService } from '@nestjs/axios';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private keycloakConfig: KeycloakConfig
  ) {
    // Log all configuration values to help debug
    this.logger.log(`Keycloak Configuration:`);
    this.logger.log(`Base URL: ${this.keycloakConfig.getBaseUrl()}`);
    this.logger.log(`Realm: ${this.keycloakConfig.getRealm()}`);
    this.logger.log(`Client ID: ${this.keycloakConfig.getClientId()}`);
    this.logger.log(`Client Secret: ${this.keycloakConfig.getClientSecret() ? 'Set' : 'Not Set'}`);
    this.logger.log(`Token URL: ${this.keycloakConfig.getTokenUrl()}`);
    this.logger.log(`Certs URL: ${this.keycloakConfig.getCertsUrl()}`);
  }

  /**
   * Get Keycloak token URL
   */
  private getTokenUrl(): string {
    return `${this.keycloakConfig.getBaseUrl()}/realms/${this.keycloakConfig.getRealm()}/protocol/openid-connect/token`;
  }

  /**
   * Get Keycloak logout URL
   */
  private getLogoutUrl(): string {
    return `${this.keycloakConfig.getBaseUrl()}/realms/${this.keycloakConfig.getRealm()}/protocol/openid-connect/logout`;
  }

  /**
   * Get Keycloak user info URL
   */
  private getUserInfoUrl(): string {
    return `${this.keycloakConfig.getBaseUrl()}/realms/${this.keycloakConfig.getRealm()}/protocol/openid-connect/userinfo`;
  }

  /**
   * Get Keycloak admin token
   */
  async getAdminToken(): Promise<string> {
    const data = querystring.stringify({
      grant_type: 'password',
      client_id: 'admin-cli',
      username: this.keycloakConfig.getAdminUsername(),
      password: this.keycloakConfig.getAdminPassword(),
    });

    try {
      const response = await axios.post(
        `${this.keycloakConfig.getBaseUrl()}/realms/master/protocol/openid-connect/token`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get admin token:', error);
      throw new Error('Failed to get admin token');
    }
  }

  /**
   * Login user with username and password
   */
  async login(username: string, password: string): Promise<any> {
    try {
      const payload = new URLSearchParams({
        username,
        password,
        grant_type: 'password',
        client_id: this.keycloakConfig.getClientId(),
        client_secret: this.keycloakConfig.getClientSecret(),
      });

      this.logger.log(`Attempting login for user: ${username}`);
      
      const response = await firstValueFrom(
        this.httpService.post(this.getTokenUrl(), payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      this.logger.log(`Successful login for user: ${username}`);
      return response.data;
    } catch (error) {
      this.logger.error('Login error:', error.response?.data || error.message);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Exchange Google token for Keycloak token
   */
  async exchangeGoogleToken(googleToken: string): Promise<any> {
    const data = querystring.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
      client_id: this.keycloakConfig.getClientId(),
      client_secret: this.keycloakConfig.getClientSecret(),
      subject_token: googleToken,
      subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
      subject_issuer: 'google',
    });

    try {
      const response = await axios.post(this.getTokenUrl(), data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Google token exchange failed:', error.response?.data || error.message);
      throw new Error('Google authentication failed');
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string): Promise<any> {
    const data = querystring.stringify({
      grant_type: 'refresh_token',
      client_id: this.keycloakConfig.getClientId(),
      client_secret: this.keycloakConfig.getClientSecret(),
      refresh_token: refreshToken,
    });

    try {
      const response = await axios.post(this.getTokenUrl(), data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Token refresh failed:', error.response?.data || error.message);
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Logout
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = new URLSearchParams({
        client_id: this.keycloakConfig.getClientId(),
        client_secret: this.keycloakConfig.getClientSecret(),
        refresh_token: refreshToken,
      });

      this.logger.log('Logging out user');
      
      await firstValueFrom(
        this.httpService.post(this.getLogoutUrl(), payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
      
      this.logger.log('User logged out successfully');
    } catch (error) {
      this.logger.error('Logout error:', error.response?.data || error.message);
      // We don't throw here as logout should succeed even if Keycloak fails
    }
  }

  /**
   * Get user info
   */
  async getUserInfo(accessToken: string): Promise<any> {
    try {
      this.logger.log('Fetching user info from Keycloak');
      
      const response = await firstValueFrom(
        this.httpService.get(this.getUserInfoUrl(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      this.logger.log(`User info fetched successfully`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching user info:', error.response?.data || error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Get JWKS
   */
  async getJwks(): Promise<any> {
    try {
      this.logger.log(`Fetching JWKS from: ${this.keycloakConfig.getCertsUrl()}`);
      
      const response = await firstValueFrom(
        this.httpService.get(this.keycloakConfig.getCertsUrl())
      );

      this.logger.log('JWKS fetched successfully');
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching JWKS:', error.response?.data || error.message);
      throw new Error('Failed to fetch JWT signing keys');
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      // Get admin token
      const adminToken = await this.getAdminToken();
      
      // Get user ID by email
      const userResponse = await axios.get(
        `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        },
      );
      
      if (!userResponse.data || userResponse.data.length === 0) {
        throw new Error('User not found');
      }
      
      const userId = userResponse.data[0].id;
      
      // Execute reset password action
      await axios.put(
        `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users/${userId}/execute-actions-email`,
        ['UPDATE_PASSWORD'],
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            client_id: this.keycloakConfig.getClientId(),
            redirect_uri: this.configService.get<string>('APP_URL'),
          },
        },
      );
    } catch (error) {
      this.logger.error('Password reset failed:', error.response?.data || error.message);
      throw new Error('Password reset failed');
    }
  }
}
