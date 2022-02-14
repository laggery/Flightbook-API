import { Test, TestingModule } from '@nestjs/testing';
import { TeamMemberFacade } from './team-member.facade';

describe('TeamMemberFacade', () => {
  let provider: TeamMemberFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamMemberFacade],
    }).compile();

    provider = module.get<TeamMemberFacade>(TeamMemberFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
