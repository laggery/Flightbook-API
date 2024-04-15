import { EmailService } from './email.service';
import { TestBed } from '@automock/jest';

describe('EmailService', () => {
  let service: EmailService;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(EmailService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
