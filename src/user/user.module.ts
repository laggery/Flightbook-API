import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { UserController } from './user.controller';
import { UserFacade } from './user.facade';
import { AuthModule } from '../auth/auth.module';
import { PaymentFacade } from '../payment/payment-facade';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from '../email/email.service';
import { UserControllerV2 } from './user.controllerV2';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, HttpModule],
  providers: [UserRepository, UserFacade, PaymentFacade, EmailService],
  exports: [UserRepository],
  controllers: [UserController, UserControllerV2],
})
export class UserModule {}
