import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthFacade } from './auth.facade';
import { EmailService } from '../email/email.service';
import { HttpModule } from '@nestjs/axios';
import { UserFacade } from '../user/user.facade';
import { PaymentFacade } from '../payment/payment-facade';
import { KeycloakService } from './service/keycloak.service';
import { KeycloakStrategy } from './strategy/keycloak.strategy';
import { KeycloakConfig } from './config/keycloak.config';
import { AuthControllerV2 } from './auth.controllerV2';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    ConfigModule.forRoot(),
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('TOKEN_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy, 
    KeycloakStrategy,
    AuthFacade, 
    EmailService, 
    UserFacade, 
    PaymentFacade,
    KeycloakService,
    KeycloakConfig
  ],
  controllers: [AuthController, AuthControllerV2],
  exports: [AuthService, KeycloakService, KeycloakConfig],
})
export class AuthModule { }
