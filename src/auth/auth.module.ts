import { Module, forwardRef, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthFacade } from './auth.facade';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
    HttpModule
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthFacade, EmailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
