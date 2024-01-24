import { Module } from '@nestjs/common';
import { GliderController } from './glider.controller';
import { GliderRepository } from './glider.repository';
import { GliderFacade } from './glider.facade';
import { UserModule } from 'src/user/user.module';
import { Glider } from './glider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Glider])],
  controllers: [GliderController],
  providers: [GliderRepository, GliderFacade],
  exports: [GliderFacade, GliderRepository]
})
export class GliderModule {}
