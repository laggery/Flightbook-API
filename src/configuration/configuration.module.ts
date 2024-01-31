import { Module } from '@nestjs/common';
import { ConfigurationController } from './configuration.controller';

@Module({
  controllers: [ConfigurationController]
})
export class ConfigurationModule {}
