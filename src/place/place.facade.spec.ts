import { PlaceFacade } from './place.facade';
import { UserRepository } from '../user/user.repository';
import { HttpService } from '@nestjs/axios';
import { PlaceRepository } from './place.repository';

describe('Place Facade', () => {
  let facade: PlaceFacade,
      userRepository: jest.Mocked<UserRepository>,
      httpService: jest.Mocked<HttpService>,
      placeRepository: jest.Mocked<PlaceRepository>;

  beforeAll(async () => {
    userRepository = {} as any;
    httpService = {} as any;
    placeRepository = {} as any;
    facade = new PlaceFacade(placeRepository, userRepository, httpService);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
