import { Module } from '@nestjs/common';
import { GliderController } from './glider.controller';
import { GliderService } from './glider.service';
import { GliderFacade } from './glider.facade';
import { UserModule } from 'src/user/user.module';
import { Glider } from './glider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Glider])],
  controllers: [GliderController],
  providers: [GliderService, GliderFacade],
  exports: [GliderFacade]
})
export class GliderModule {}
