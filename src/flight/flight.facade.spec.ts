import { FlightFacade } from './flight.facade';
import { FlightRepository } from './flight.repository';
import { PlaceFacade } from '../place/place.facade';
import { UserRepository } from '../user/user.repository';
import { GliderFacade } from '../glider/glider.facade';
import { FileUploadService } from '../fileupload/file-upload.service';
import { TestBed } from '@automock/jest';

describe('FlightFacade', () => {
  let provider: FlightFacade,
      flightService: jest.Mocked<FlightRepository>,
      placeFacade: jest.Mocked<PlaceFacade>,
      gliderFacade: jest.Mocked<GliderFacade>,
      userRepository: jest.Mocked<UserRepository>,
      fileUploadService: jest.Mocked<FileUploadService>

  beforeAll(async () => {
    const { unit, unitRef } = TestBed.create(FlightFacade).compile();

    provider = unit;
    flightService = unitRef.get(FlightRepository);
    placeFacade = unitRef.get(PlaceFacade);
    gliderFacade = unitRef.get(GliderFacade);
    userRepository = unitRef.get(UserRepository);
    fileUploadService = unitRef.get(FileUploadService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
