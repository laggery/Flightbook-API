import { UserRepository } from '../user/user.repository';
import { TestBed } from '@automock/jest';
import { ImportFacade } from './import.facade';
import { PlaceRepository } from '../place/place.repository';
import { GliderRepository } from '../glider/glider.repository';
import { EntityManager } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { TestUtil } from '../../test/test.util';

describe('ImportFacade', () => {
  let facade: ImportFacade,
      placeRepository: jest.Mocked<PlaceRepository>,
      gliderRepository: jest.Mocked<GliderRepository>,
      userRepository: jest.Mocked<UserRepository>,
      entityManager: jest.Mocked<EntityManager>,
      i18nService: jest.Mocked<I18nService>

   beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ImportFacade).compile();

    facade = unit;
    placeRepository = unitRef.get(PlaceRepository);
    gliderRepository = unitRef.get(GliderRepository);
    userRepository = unitRef.get(UserRepository);
    entityManager = unitRef.get(EntityManager);
    i18nService = unitRef.get(I18nService);
  });

  it('Check import type enum', async () => {
    // given
    i18nService.t.mockReturnValue("translation");

    // when
    const importTypeDtoList = await facade.getImportTypes('de');

    // then
    expect(importTypeDtoList).toHaveLength(6);
  });

  it('Import places', async () => {
    // given
    const mockUser = TestUtil.createUser();
    userRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));

    const csv = TestUtil.readFile("places.csv");
    placeRepository.convertEpsg4326toEpsg3857.mockReturnValue(Promise.resolve([{st_asgeojson: '{"coordinates":[1,1]}'}]));

    // when
    const importResultDto = await facade.importFbPlaces(csv, mockUser.id);

    // then
    expect(entityManager.transaction).toBeCalledTimes(1);
    // expect(importResultDto.place.inserted).toBe(2);
  });

  it('Import flugbuch', async () => {
    // given
    const mockUser = TestUtil.createUser();
    userRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));

    const csv = TestUtil.readFile("flugbuch.csv");

    // when
    const importResultDto = await facade.importFlugbuch(csv, mockUser.id);

    // then
    expect(entityManager.transaction).toBeCalledTimes(1);
  });

  it('Import VFRnav', async () => {
    // given
    const mockUser = TestUtil.createUser();
    userRepository.getUserById.mockReturnValue(Promise.resolve(mockUser));

    const csv = TestUtil.readFile("VFRnav.xlsx");

    // when
    const importResultDto = await facade.importVfr(csv, mockUser.id);

    // then
    expect(entityManager.transaction).toBeCalledTimes(1);
  });
});
