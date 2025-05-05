import { TestBed } from '@automock/jest';
import { ImportController } from './import.controller';
import { TestUtil } from '../../test/test.util';
import { ImportResultDto, ResultDto } from './interface/import-result-dto';
import { ImportFacade } from './import.facade';
import { ImportType } from './import-type';
import { FileUploadService } from '../fileupload/file-upload.service';
import { EmailService } from '../email/email.service';
import { ImportException } from './exception/import.exception';
import { FlugbuchFacade } from './flugbuch.facade';

describe('ImportController', () => {
  let controller: ImportController;
  let facade: jest.Mocked<ImportFacade>;
  let flugbuchFacade: jest.Mocked<FlugbuchFacade>;
  let fileUploadService: jest.Mocked<FileUploadService>;
  let emailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(ImportController).compile();

    controller = unit;
    facade = unitRef.get(ImportFacade);
    flugbuchFacade = unitRef.get(FlugbuchFacade);
    fileUploadService = unitRef.get(FileUploadService);
    emailService = unitRef.get(EmailService);
  });

  it('Import fb places', async () => {
    // given
    const importResultDto = new ImportResultDto();
    importResultDto.place = new ResultDto();
    importResultDto.place.inserted = 1;
    const placeCsv = TestUtil.readFile("places.csv");

    facade.importFbPlaces.mockResolvedValue(importResultDto);

    // when
    const response = await controller.importData(TestUtil.request, placeCsv, { type: ImportType.FB_PLACES });

    // then
    expect(facade.importFbPlaces).toHaveBeenCalled();
    expect(response.place.inserted).toEqual(1);
  });

  it('Import flugbuch', async () => {
    // given - team name
    const importResultDto = new ImportResultDto();
    importResultDto.place = new ResultDto();
    importResultDto.place.inserted = 1;
    const placeCsv = TestUtil.readFile("flugbuch.csv");

    flugbuchFacade.importFlugbuch.mockResolvedValue(importResultDto);

    // when
    const response = await controller.importData(TestUtil.request, placeCsv, { type: ImportType.FLUGBUCH });

    // then
    expect(flugbuchFacade.importFlugbuch).toHaveBeenCalled();
    expect(response.place.inserted).toEqual(1);
  });

  it('has import Error', async () => {
    // given
    const placeCsv = TestUtil.readFile("places.csv");
    facade.importFbPlaces.mockImplementation(() => {
      throw ImportException.importFailedException();
    });
    fileUploadService.uploadErrorImportFile.mockReturnValue(Promise.resolve("key"))

    
    expect(async () => {
      // when
      await controller.importData(TestUtil.request, placeCsv, { type: ImportType.FB_PLACES });

      // then
      expect(facade.importFbPlaces).toHaveBeenCalled();
      expect(fileUploadService.uploadErrorImportFile).toHaveBeenCalled();
      expect(emailService.sendErrorMessageToAdmin).toHaveBeenCalled();
    }).rejects.toThrow();
    
  });

  it('has call getImportTypes', async () => {
    // when
    await controller.getImportTypes("de");
    
    // then
    expect(facade.getImportTypes).toHaveBeenCalled();
    
  });
});
