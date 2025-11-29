import { UserRepository } from '../user/user.repository';
import { ImportFacade } from './import.facade';
import { PlaceRepository } from '../place/place.repository';
import { GliderRepository } from '../glider/glider.repository';
import { EntityManager } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Testdata } from '../../test/testdata';

describe('ImportFacade', () => {
  let facade: ImportFacade,
      placeRepository: jest.Mocked<PlaceRepository>,
      gliderRepository: jest.Mocked<GliderRepository>,
      userRepository: jest.Mocked<UserRepository>,
      entityManager: jest.Mocked<EntityManager>,
      i18nService: jest.Mocked<I18nService>

   beforeEach(async () => {
    placeRepository = {
      convertEpsg4326toEpsg3857: jest.fn(),
    } as any;

    gliderRepository = {} as any;

    userRepository = {
      getUserById: jest.fn(),
    } as any;

    entityManager = {
      transaction: jest.fn(),
    } as any;

    i18nService = {
      t: jest.fn(),
    } as any;

    facade = new ImportFacade(
      gliderRepository,
      placeRepository,
      userRepository,
      entityManager,
      i18nService
    );
  });

  it('Check import type enum', async () => {
    // given
    i18nService.t.mockReturnValue("translation");

    // when
    const importTypeDtoList = await facade.getImportTypes('de');

    // then
    expect(importTypeDtoList).toHaveLength(5);
  });

  it('Import places', async () => {
    // given
    const mockUser = Testdata.getDefaultUser();
    userRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));

    const csv = Testdata.readFile("places.csv");
    placeRepository.convertEpsg4326toEpsg3857.mockReturnValue(Promise.resolve([{st_asgeojson: '{"coordinates":[1,1]}'}]));

    // when
    const importResultDto = await facade.importFbPlaces(csv, mockUser.id);

    // then
    expect(entityManager.transaction).toHaveBeenCalledTimes(1);
    // expect(importResultDto.place.inserted).toBe(2);
  });

  it('Import flugbuch', async () => {
    // given
    const mockUser = Testdata.getDefaultUser();
    userRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));

    const csv = Testdata.readFile("flugbuch.csv");

    // when
    const importResultDto = await facade.importFlugbuch(csv, mockUser.id);

    // then
    expect(entityManager.transaction).toHaveBeenCalledTimes(1);
  });

  it('Import VFRnav', async () => {
    // given
    const mockUser = Testdata.getDefaultUser();
    userRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));

    const csv = Testdata.readFile("VFRnav.xlsx");

    // when
    const importResultDto = await facade.importVfr(csv, mockUser.id);

    // then
    expect(entityManager.transaction).toHaveBeenCalledTimes(1);
  });
});
