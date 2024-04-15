import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentFacade } from './payment-facade';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from '../user/user.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [PaymentController],
  providers: [PaymentFacade, EmailService],
  exports: [PaymentFacade]
})
export class PaymentModule {}
