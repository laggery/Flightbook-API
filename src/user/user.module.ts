import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserFacade } from './user.facade';
import { AuthModule } from 'src/auth/auth.module';
import { PaymentFacade } from 'src/payment/payment-facade';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, HttpModule],
  providers: [UserService, UserFacade, PaymentFacade, EmailService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
