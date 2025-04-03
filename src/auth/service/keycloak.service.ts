import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as querystring from 'querystring';
import { KeycloakConfig } from '../config/keycloak.config';
import { HttpService } from '@nestjs/axios';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { User } from '../../user/user.entity';

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private keycloakConfig: KeycloakConfig
  ) {}

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

  private getUserByEmailUrl(email: string): string {
    return `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users?email=${encodeURIComponent(email)}`;
  }

  /**
   * Get Keycloak admin token
   */
  private async getAdminToken(): Promise<string> {
    const data = querystring.stringify({
      grant_type: 'password',
      client_id: 'admin-cli',
      username: this.keycloakConfig.getAdminUsername(),
      password: this.keycloakConfig.getAdminPassword(),
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.keycloakConfig.getBaseUrl()}/realms/master/protocol/openid-connect/token`,
          data,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
      return response.data.access_token;
    } catch (error) {
      this.logger.debug('Failed to get admin token:', error);
      throw new Error('Failed to get admin token');
    }
  }

  /**
   * Get Keycloak users URL
   */
  private getUsersUrl(): string {
    return `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users`;
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
        scope: 'openid profile email'
      });

      const response = await firstValueFrom(
        this.httpService.post(this.getTokenUrl(), payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.debug('Login error:', error.response?.data || error.message);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      const adminToken = await this.getAdminToken();
      
      const response = await firstValueFrom(
        this.httpService.get(this.getUserByEmailUrl(email), {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        })
      );
      
      const users = response.data;
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      this.logger.debug(`Failed to get user from Keycloak: ${error.message}`);
      return null;
    }
  }

  /**
   * Create a new user in Keycloak
   * @param user The user to create in Keycloak
   * @param password The initial password for the user
   * @returns The Keycloak user ID
   */
  async createUser(user: User, password: string, emailVerified: boolean): Promise<string> {
    try {
      const adminToken = await this.getAdminToken();
      
      const userData = {
        username: user.email,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        enabled: true,
        emailVerified: emailVerified,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false
          }
        ],
        attributes: {
          flightbookUserId: user.id ? [user.id.toString()] : []
        }
      };
      
      const response = await firstValueFrom(
        this.httpService.post(this.getUsersUrl(), userData, {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        })
      );
      
      // Get the user ID from the Location header
      const locationHeader = response.headers.location;
      const userId = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);
      
      return userId;
    } catch (error) {
      this.logger.debug('Error creating Keycloak user:', error.response?.data || error.message);
      throw new Error('Failed to create user in Keycloak');
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
      const response = await firstValueFrom(this.httpService.post(this.getTokenUrl(), data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }));
      return response.data;
    } catch (error) {
      return null;
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
      
      await firstValueFrom(
        this.httpService.post(this.getLogoutUrl(), payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );
    } catch (error) {
      this.logger.debug('Logout error:', error.response?.data || error.message);
      // We don't throw here as logout should succeed even if Keycloak fails
    }
  }

  /**
   * Get user info
   */
  async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.getUserInfoUrl(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

      return response.data;
    } catch (error) {
      this.logger.debug('Error fetching user info:', error.response?.data || error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Get JWKS
   */
  async getJwks(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.keycloakConfig.getCertsUrl())
      );

      return response.data;
    } catch (error) {
      this.logger.debug('Error fetching JWKS:', error.response?.data || error.message);
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
      const userResponse = await firstValueFrom(
        this.httpService.get(
          `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users?email=${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          },
        ),
      );
      
      if (!userResponse.data || userResponse.data.length === 0) {
        throw new Error('User not found');
      }
      
      const userId = userResponse.data[0].id;
      
      // Execute reset password action
      await firstValueFrom(
        this.httpService.put(
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
        ),
      );
    } catch (error) {
      this.logger.debug('Password reset failed:', error.response?.data || error.message);
      throw new Error('Password reset failed');
    }
  }

  /**
   * Update an existing user in Keycloak
   * @param userId The Keycloak user ID
   * @param userData The user data to update
   * @returns Promise<void>
   */
  async updateUser(keycloakId: string, user: User): Promise<void> {
    try {
      const adminToken = await this.getAdminToken();
      
      // First get the current user data
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users/${keycloakId}`,
          {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );
      
      const userData = response.data;

      userData.username = user.email;
      userData.email = user.email;
      userData.firstName = user.firstname;
      userData.lastName = user.lastname;
      userData.enabled = true;
      userData.emailVerified = true;
      userData.attributes = {
        flightbookUserId: [user.id.toString()]
      }
      
      // Send the update request with complete user data
      await firstValueFrom(
        this.httpService.put(
          `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users/${keycloakId}`,
          userData,
          {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );  
    } catch (error) {
      this.logger.debug('Error updating Keycloak user:', error.response?.data || error.message);
      throw new Error('Failed to update user in Keycloak');
    }
  }

  public async changePassword(user: User, newPassword: string): Promise<void> {
    try {
      // Check if user exists
      const adminToken = await this.getAdminToken();
      const userResponse = await firstValueFrom(
        this.httpService.get(
          `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users/${user.keycloakId}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          },
        ),
      );
      if (!userResponse.data) {
        throw new Error('User not found in Keycloak');
      }

      // Set new password
      await firstValueFrom(
        this.httpService.put(
          `${this.keycloakConfig.getBaseUrl()}/admin/realms/${this.keycloakConfig.getRealm()}/users/${user.keycloakId}/reset-password`,
          {
            type: 'password',
            value: newPassword,
            temporary: false,
          },
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
    } catch (error) {
      this.logger.debug('Error changing password:', error.response?.data || error.message);
      throw new Error('Failed to change password');
    }
  }

  public async validateUserPassword(user: User, password: string): Promise<boolean> {
    try {
      const payload = new URLSearchParams({
        username: user.email,
        password,
        grant_type: 'password',
        client_id: this.keycloakConfig.getClientId(),
        client_secret: this.keycloakConfig.getClientSecret(),
        scope: 'openid profile email'
      });

      await firstValueFrom(
        this.httpService.post(this.getTokenUrl(), payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      );

      return true;
    } catch (error) {
      return false;
    }
  }
}
