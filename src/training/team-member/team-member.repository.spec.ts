import { TeamMemberRepository } from './team-member.repository';
import { Repository } from 'typeorm';
import { TeamMember } from './team-member.entity';

describe('teamMemberRepository', () => {
  let teamMemberRepository: TeamMemberRepository;

  beforeAll(async () => {
    const repository = {} as Repository<TeamMember>;
    teamMemberRepository = new TeamMemberRepository(repository);
  });

  it('should be defined', () => {
    expect(teamMemberRepository).toBeDefined();
  });
});
