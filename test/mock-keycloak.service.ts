import { User } from "../src/user/domain/user.entity";

export class MockKeycloakService {

  constructor() {}

  /**
   * Login user with username and password
   */
  async login(username: string, password: string): Promise<any> {
    return {
      access_token: 'mocked-access-token',
      refresh_token: 'mocked-refresh-token',
      expires_in: 300,
      refresh_expires_in: 1800,
      token_type: 'Bearer',
      not_before_policy: 0,
      session_state: 'mocked-session-state',
      scope: 'openid email profile',
    };
  }

  async getUserByEmail(email: string): Promise<any> {
    return null; // Simulate user not found
  }

  async createUser(user: User, password: string, emailVerified: boolean): Promise<string> {
    return 'mocked-keycloak-user-id';
  }

  async refreshToken(refreshToken: string): Promise<any> {
    return {
      access_token: 'mocked-new-access-token',
      refresh_token: 'mocked-new-refresh-token',
      expires_in: 300,
      refresh_expires_in: 1800,
      token_type: 'Bearer',
      not_before_policy: 0,
      session_state: 'mocked-session-state',
      scope: 'openid email profile',
    };
  }

  async logout(refreshToken: string): Promise<void> {
    return;
  }

  async getUserInfo(accessToken: string): Promise<any> {
    return {
      sub: 'mocked-user-id',
      email: 'mocked-email@example.com',
      name: 'Mocked User',
      given_name: 'Mocked',
      family_name: 'User',
      preferred_username: 'mocked-username',
      email_verified: true,
      realm: 'mocked-realm',
    };
  }

  async getJwks(): Promise<any> {
    return null;
  }

  async updateUser(keycloakId: string, user: User): Promise<void> {
    return;
  }

  public async changePassword(user: User, newPassword: string): Promise<void> {
    return;
  }

  public async validateUserPassword(user: User, password: string): Promise<boolean> {
    return true;
  }
}
