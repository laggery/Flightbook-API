import { Module } from '@nestjs/common';
import { TandemController } from './tandem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerConfirmationModule } from './passenger-confirmation/passenger-confirmation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    PassengerConfirmationModule
  ],
  controllers: [TandemController],
  providers: []
})
export class TandemModule {}
