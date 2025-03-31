import {
  Body,
  Controller, Delete,
  Get, HttpCode,
  Logger,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CopyFileDto } from './interface/copyFile-dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ImportFacade } from '../import/import.facade';
import { ImportResultDto } from '../import/interface/import-result-dto';
import { ImportType } from '../import/import-type';
import { ImportException } from '../import/exception/import.exception';
import { EmailService } from '../email/email.service';

@Controller('file')
@ApiTags('File Upload')
@ApiBearerAuth('jwt')
export class FileUploadController {

  constructor(
    private fileUploadService: FileUploadService,
    private importFacade: ImportFacade,
    private emailService: EmailService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.fileUpload(file, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'filename', required: true, schema: { oneOf: [{ type: 'string' }] } })
  @Get('upload/url/:filename')
  async getSignedFileUploadUrl(@Request() req, @Param('filename') filename) {
    return this.fileUploadService.getSignedFileUploadUrl(filename, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('copy')
  async copyFile(@Request() req, @Body() copyFile: CopyFileDto) {
    return this.fileUploadService.copyFile(req.user.userId, copyFile);
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'filename', required: true, schema: { oneOf: [{ type: 'string' }] } })
  @Get(':filename')
  async getFile(@Request() req, @Param('filename') filename) {
    return await this.fileUploadService.getFile(req.user.userId, filename);
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'filename', required: true, schema: { oneOf: [{ type: 'string' }] } })
  @Delete(':filename')
  @HttpCode(204)
  async deleteFile(@Request() req, @Param('filename') filename) {
    return await this.fileUploadService.deleteFile(req.user.userId, filename);
  }

  @ApiOperation({ deprecated: true })
  @UseGuards(JwtAuthGuard)
  @Post('import')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'type', required: true, enum: ImportType })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importData(@Request() req, @UploadedFile() file: Express.Multer.File, @Query() query): Promise<ImportResultDto> {
    switch (query.type) {
      case ImportType.FLUGBUCH:
        try {
          return await this.importFacade.importFlugbuch(file, req.user.userId);
        } catch (e) {
          Logger.error('Import error', e.stack, 'importFacade.importFlugbuch');
          const key = await this.fileUploadService.uploadErrorImportFile(req.user.userId, file);
          const content = `<p>Import has failed for user id: ${req.user.userId} with object key: ${key}<p>`;
          this.emailService.sendErrorMessageToAdmin(`${ImportType.FLUGBUCH} Import error`, content);
          throw e;
        }
      case ImportType.XCONTEST:
        try {
          return await this.importFacade.importXContest(file, req.user.userId);
        } catch (e) {
          Logger.error('Import error', e.stack, 'importFacade.importXContest');
          const key = await this.fileUploadService.uploadErrorImportFile(req.user.userId, file);
          const content = `<p>Import has failed for user id: ${req.user.userId} with object key: ${key}<p>`;
          this.emailService.sendErrorMessageToAdmin(`${ImportType.FLUGBUCH} Import error`, content);
          throw e;
        }  
      case ImportType.CUSTOM:
        try {
          return await this.importFacade.importCustom(file, req.user.userId);
        } catch (e) {
          Logger.error('Import error', e.stack, 'importFacade.importCustom');
          throw e;
        }
      case ImportType.FB_PLACES:
        try {
          return await this.importFacade.importFbPlaces(file, req.user.userId);
        } catch (e) {
          Logger.error('Import error', e.stack, 'importFacade.importFbPlaces');
          throw e;
        }
      case ImportType.VFR:
        try {
          return await this.importFacade.importVfr(file, req.user.userId);
        } catch (e) {
          Logger.error('Import error', e.stack, 'importFacade.importVfr');
          throw e;
        }
        case ImportType.LOGFLY:
          try {
            return await this.importFacade.importLogfly(file, req.user.userId);
          } catch (e) {
            Logger.error('Import error', e.stack, 'importFacade.importLogfly');
            throw e;
          }
      default:
        ImportException.unsupportedImportTypeException();
    }
  }

}
