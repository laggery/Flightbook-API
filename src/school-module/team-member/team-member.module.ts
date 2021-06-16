import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './team-member.entity';
import { TeamMemberService } from './team-member.service';
import { TeamMemberFacade } from './team-member.facade';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember])],  
  providers: [TeamMemberService, TeamMemberFacade]
})
export class TeamMemberModule {}
