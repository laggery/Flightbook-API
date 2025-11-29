import { TeamMemberFacade } from './team-member.facade';
import { TeamMemberRepository } from './team-member.repository';

describe('TeamMemberFacade', () => {
  let facade: TeamMemberFacade;
  let teamMemberRepository: jest.Mocked<TeamMemberRepository>;

  beforeAll(async () => {
    teamMemberRepository = {} as any;
    facade = new TeamMemberFacade(teamMemberRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
