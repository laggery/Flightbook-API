import { NotificationsService } from './notifications.service';
import { UserRepository } from '../../user/user.repository';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let userRepository: jest.Mocked<UserRepository>;
  let json: jest.Mocked<JSON>;

  beforeAll(async () => {
    userRepository = {} as any;
    service = new NotificationsService(userRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
