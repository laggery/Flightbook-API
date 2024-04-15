import { TeamMemberRepository } from './team-member.repository';
import { TestBed } from '@automock/jest';

describe('teamMemberRepository', () => {
  let teamMemberRepository: TeamMemberRepository;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(TeamMemberRepository).compile();

    teamMemberRepository = unit;
  });

  it('should be defined', () => {
    expect(teamMemberRepository).toBeDefined();
  });
});
