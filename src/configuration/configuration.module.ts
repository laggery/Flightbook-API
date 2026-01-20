import { Module } from '@nestjs/common';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationFacade } from './configuration.facade';

@Module({
  controllers: [ConfigurationController],
  providers: [ConfigurationFacade]
})
export class ConfigurationModule {}
