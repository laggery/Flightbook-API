import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserFacade } from './user.facade';
import { AuthModule } from 'src/auth/auth.module';
import { TeamMemberModule } from 'src/team-member/team-member.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, TeamMemberModule],
  providers: [UserService, UserFacade],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
