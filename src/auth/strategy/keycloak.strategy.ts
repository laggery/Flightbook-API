import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { KeycloakService } from '../service/keycloak.service';
import { UserRepository } from '../../user/user.repository';
import { KeycloakConfig } from '../config/keycloak.config';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  private readonly logger = new Logger(KeycloakStrategy.name);

  constructor(
    private configService: ConfigService,
    private keycloakService: KeycloakService,
    private userRepository: UserRepository,
    private keycloakConfig: KeycloakConfig
  ) {    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: keycloakConfig.getClientSecret(),
      algorithms: ['HS256'],
    });
    
    this.logger.log(`Keycloak strategy initialized with client ID: ${keycloakConfig.getClientId()}`);
  }

  async validate(payload: any) {
    try {
      if (!payload) {
        this.logger.error('No payload in token');
        throw new UnauthorizedException('Invalid token - no payload');
      }
      
      if (!payload.sub) {
        this.logger.error('No sub claim in token payload');
        throw new UnauthorizedException('Invalid token - missing subject');
      }

      this.logger.log(`Looking up user with Keycloak ID: ${payload.sub}`);
      
      const user = await this.userRepository.getUserByKeycloakId(payload.sub);
      
      if (!user) {
        this.logger.log(`No user found with Keycloak ID: ${payload.sub}, trying email lookup`);
        
        const emailUser = payload.email ? await this.userRepository.getUserByEmail(payload.email) : null;
        
        if (emailUser) {
          this.logger.log(`Found user by email: ${payload.email}, updating Keycloak ID`);
          emailUser.keycloakId = payload.sub;
          await this.userRepository.saveUser(emailUser);
          
          if (!emailUser.enabled) {
            this.logger.error(`User account is disabled: ${emailUser.id}`);
            throw new UnauthorizedException('User account is disabled');
          }
          
          this.logger.log(`User authenticated by email lookup: ${emailUser.id}`);
          return {
            userId: emailUser.id,
            email: payload.email,
            keycloakId: payload.sub,
            roles: payload.realm_access?.roles || [],
          };
        }
        
        this.logger.error(`User not found by Keycloak ID or email: ${payload.sub}, ${payload.email}`);
        throw new UnauthorizedException('User not found');
      }
      
      if (!user.enabled) {
        this.logger.error(`User account is disabled: ${user.id}`);
        throw new UnauthorizedException('User account is disabled');
      }

      this.logger.log(`User authenticated: ${user.id}`);
      
      return {
        userId: user.id,
        email: payload.email || user.email,
        keycloakId: payload.sub,
        roles: payload.realm_access?.roles || [],
      };
    } catch (error) {
      this.logger.error('Token validation error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
