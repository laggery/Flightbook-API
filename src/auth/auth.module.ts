import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthFacade, EmailService, UserFacade, PaymentFacade],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
