import { NotificationsService } from './notifications.service';
import { TestBed } from '@automock/jest';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let json: jest.Mocked<JSON>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(NotificationsService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
