import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './services/notifications.service';
import { UserModule } from '../user/user.module';
import { GoogleCalendarService } from './services/google-calendar.service';

@Module({
  imports: [UserModule, ConfigModule],
  providers: [NotificationsService, GoogleCalendarService],
  exports: [NotificationsService, GoogleCalendarService],
})
export class SharedModule {}
