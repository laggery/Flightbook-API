import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentFacade } from './payment-facade';
import { HttpModule, HttpService } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [PaymentController],
  providers: [PaymentFacade, EmailService]
})
export class PaymentModule {}
