import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './team-member.entity';
import { TeamMemberRepository } from './team-member.repository';
import { TeamMemberFacade } from './team-member.facade';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember])],  
  providers: [TeamMemberRepository, TeamMemberFacade],
  exports: [TeamMemberFacade, TeamMemberRepository]
})
export class TeamMemberModule {}
