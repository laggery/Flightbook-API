import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../user/user.repository';
import { KeycloakConfig } from '../config/keycloak.config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  private readonly logger = new Logger(KeycloakStrategy.name);

  constructor(
    private userRepository: UserRepository,
    private keycloakConfig: KeycloakConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${keycloakConfig.getBaseUrl()}/realms/${keycloakConfig.getRealm()}/protocol/openid-connect/certs`,
      }),
      algorithms: ['RS256'], // Keycloak's default algorithm
    });
  }

  async validate(payload: any) {
    try {
      if (!payload) {
        this.logger.debug('No payload in token');
        throw new UnauthorizedException('Invalid token - no payload');
      }
      
      if (!payload.sub) {
        this.logger.debug('No sub claim in token payload');
        throw new UnauthorizedException('Invalid token - missing subject');
      }
      
      // Find user by Keycloak ID
      const user = await this.userRepository.getUserByKeycloakId(payload.sub);
      
      if (!user) {
        this.logger.debug(`User with Keycloak ID ${payload.sub} not found`);
        throw new UnauthorizedException('User not found');
      }
      
      return { 
        userId: user.id,
        email: user.email,
        keycloakId: user.keycloakId
      };
    } catch (error) {
      this.logger.debug(`Token validation error: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
