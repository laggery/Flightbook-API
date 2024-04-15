import { TeamMemberFacade } from './team-member.facade';
import { TestBed } from '@automock/jest';
import { TeamMemberRepository } from './team-member.repository';

describe('TeamMemberFacade', () => {
  let facade: TeamMemberFacade;
  let teamMemberRepository: jest.Mocked<TeamMemberRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(TeamMemberFacade).compile();

    facade = unit;
    teamMemberRepository = unitRef.get(TeamMemberRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
