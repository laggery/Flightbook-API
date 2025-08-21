import { Injectable } from '@nestjs/common';
import * as querystring from 'querystring';
import { KeycloakConfig } from '../config/keycloak.config';
import { HttpService } from '@nestjs/axios';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { User } from '../../user/domain/user.entity';

@Injectable()
export class KeycloakService {
  private readonly logger = new Logger(KeycloakService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly keycloakConfig: KeycloakConfig
  ) {}

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
          this.keycloakConfig.getAdminTokenUrl(),
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
        this.httpService.post(this.keycloakConfig.getTokenUrl(), payload.toString(), {
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
        this.httpService.get(this.keycloakConfig.getUserByEmailUrl(email), {
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
        this.httpService.post(this.keycloakConfig.getUsersUrl(), userData, {
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
      const response = await firstValueFrom(this.httpService.post(this.keycloakConfig.getTokenUrl(), data, {
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
        this.httpService.post(this.keycloakConfig.getLogoutUrl(), payload.toString(), {
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
        this.httpService.get(this.keycloakConfig.getUserInfoUrl(), {
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
          `${this.keycloakConfig.getUsersUrl()}/${keycloakId}`,
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
          `${this.keycloakConfig.getUsersUrl()}/${keycloakId}`,
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
          `${this.keycloakConfig.getUsersUrl()}/${user.keycloakId}`,
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
          `${this.keycloakConfig.getUsersUrl()}/${user.keycloakId}/reset-password`,
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
        this.httpService.post(this.keycloakConfig.getTokenUrl(), payload.toString(), {
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
