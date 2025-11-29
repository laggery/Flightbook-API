import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeAll(async () => {
    service = new EmailService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
