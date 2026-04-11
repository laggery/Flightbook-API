import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from '../../training/student/student.module';
import { UserModule } from '../../user/user.module';
import { School } from './domain/school.entity';
import { SchoolFacade } from './school.facade';
import { SchoolRepository } from './school.repository';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [
    UserModule,
    SharedModule,
    forwardRef(() => StudentModule), 
    TypeOrmModule.forFeature([School])
  ],
  controllers: [],
  providers: [SchoolFacade, SchoolRepository],
  exports: [SchoolFacade, SchoolRepository]
})
export class SchoolModule {}
