import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from '../../training/student/student.module';
import { UserModule } from '../../user/user.module';
import { School } from './school.entity';
import { SchoolFacade } from './school.facade';
import { SchoolRepository } from './school.repository';

@Module({
  imports: [
    UserModule, 
    forwardRef(() => StudentModule), 
    TypeOrmModule.forFeature([School])
  ],
  controllers: [],
  providers: [SchoolFacade, SchoolRepository],
  exports: [SchoolFacade, SchoolRepository]
})
export class SchoolModule {}
