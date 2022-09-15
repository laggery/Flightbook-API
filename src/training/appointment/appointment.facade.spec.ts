import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentFacade } from './appointment.facade';

describe('AppointmentFacade', () => {
  let provider: AppointmentFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentFacade],
    }).compile();

    provider = module.get<AppointmentFacade>(AppointmentFacade);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
