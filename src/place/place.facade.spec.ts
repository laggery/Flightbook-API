import { PlaceFacade } from './place.facade';
import { UserRepository } from '../user/user.repository';
import { HttpService } from '@nestjs/axios';
import { PlaceRepository } from './place.repository';
import { TestBed } from '@automock/jest';

describe('Place Facade', () => {
  let facade: PlaceFacade,
      userRepository: jest.Mocked<UserRepository>,
      httpService: jest.Mocked<HttpService>,
      placeRepository: jest.Mocked<PlaceRepository>;

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(PlaceFacade).compile();

    facade = unit;
    httpService = unitRef.get(HttpService);
    userRepository = unitRef.get(UserRepository);
    placeRepository = unitRef.get(PlaceRepository);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });
});
