import { Controller, Get, Headers, Logger, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ImportType } from './import-type';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ImportFacade } from './import.facade';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportResultDto } from './interface/import-result-dto';
import { EmailService } from '../email/email.service';
import { FileUploadService } from '../fileupload/file-upload.service';
import { ImportException } from './exception/import.exception';

@Controller('import')
@ApiTags('Import')
@ApiBearerAuth('jwt')
export class ImportController {

    constructor(
        private importFacade: ImportFacade,
        private emailService: EmailService,
        private fileUploadService: FileUploadService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('types')
    getImportTypes(@Headers('accept-language') acceptLanguage: string): any[] {
        return this.importFacade.getImportTypes(acceptLanguage);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
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
                    await this.logError(ImportType.FLUGBUCH, req.user.userId, file, e);
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
                    await this.logError(ImportType.FB_PLACES, req.user.userId, file, e);
                    throw e;
                }
            default:
                ImportException.unsupportedImportTypeException();
        }
    }

    private async logError(importType: ImportType, userId: number, file: Express.Multer.File, error: any) {
        Logger.error('Import error', error.stack, `importFacade for ${importType}`);
        const key = await this.fileUploadService.uploadErrorImportFile(userId, file);
        const content = `<p>${importType} import has failed for user id: ${userId} with object key: ${key}<p>`;
        this.emailService.sendErrorMessageToAdmin(`${importType} import error`, content);
    }

}
