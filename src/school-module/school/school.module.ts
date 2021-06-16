import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { SchoolController } from './school.controller';
import { School } from './school.entity';
import { SchoolFacade } from './school.facade';
import { SchoolService } from './school.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([School])],
  controllers: [SchoolController],
  providers: [SchoolFacade, SchoolService],
  exports: [SchoolFacade]
})
export class SchoolModule {}
