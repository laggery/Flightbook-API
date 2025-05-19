import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class SharedModule {}
