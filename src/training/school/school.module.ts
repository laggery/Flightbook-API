import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from 'src/training/student/student.module';
import { UserModule } from 'src/user/user.module';
import { School } from './school.entity';
import { SchoolFacade } from './school.facade';
import { SchoolService } from './school.service';

@Module({
  imports: [
    UserModule, 
    forwardRef(() => StudentModule), 
    TypeOrmModule.forFeature([School])
  ],
  controllers: [],
  providers: [SchoolFacade, SchoolService],
  exports: [SchoolFacade, SchoolService]
})
export class SchoolModule {}
