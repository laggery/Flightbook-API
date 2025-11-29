import { FlightFacade } from './flight.facade';
import { FlightRepository } from './flight.repository';
import { PlaceFacade } from '../place/place.facade';
import { UserRepository } from '../user/user.repository';
import { GliderFacade } from '../glider/glider.facade';
import { FileUploadService } from '../fileupload/file-upload.service';
import { NotificationsService } from '../shared/services/notifications.service';

describe('FlightFacade', () => {
  let provider: FlightFacade,
      flightService: jest.Mocked<FlightRepository>,
      placeFacade: jest.Mocked<PlaceFacade>,
      gliderFacade: jest.Mocked<GliderFacade>,
      userRepository: jest.Mocked<UserRepository>,
      fileUploadService: jest.Mocked<FileUploadService>,
      notificationsService: jest.Mocked<NotificationsService>

  beforeAll(async () => {
    flightService = {} as any;
    placeFacade = {} as any;
    gliderFacade = {} as any;
    userRepository = {} as any;
    fileUploadService = {} as any;
    notificationsService = {} as any;
    provider = new FlightFacade(flightService, placeFacade, gliderFacade, userRepository, fileUploadService, notificationsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
