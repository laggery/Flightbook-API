import { Module, MiddlewareConsumer, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightModule } from './flight/flight.module';
import { Connection } from 'typeorm';
import { FlightController } from './flight/flight.controller';
import { PlaceModule } from './place/place.module';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { EntityNotFoundFilter } from './exception/entity-not-found-filter';
import { QueryFailedErrorFilter } from './exception/query-failed-error-filter';
import { GliderModule } from './glider/glider.module';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';
import {dbConfig} from './db/db-config';
import { FileUploadModule } from './fileupload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dbConfig),
    AuthModule,
    FlightModule,
    FileUploadModule,
    PlaceModule,
    UserModule,
    GliderModule,
    NewsModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: EntityNotFoundFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedErrorFilter,
    },
    EmailService
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }

  configure(consumer: MiddlewareConsumer) {
    // IMPORTANT! Call Middleware.configure BEFORE using it for routes
    HelmetMiddleware.configure({});
    consumer.apply(HelmetMiddleware).forRoutes(
      FlightController,
    );
  }
}
