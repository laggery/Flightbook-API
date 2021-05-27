import {
    Controller,
    Post,
    UseInterceptors, UploadedFile, Param, UseGuards, UploadedFiles, Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('upload')
export class FileUploadController {

    constructor(private fileUploadService: FileUploadService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('/igcfile')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
        return this.fileUploadService.fileUpload(file, 'staging', req.user.userId);
    }

}
