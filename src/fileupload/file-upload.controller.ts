import {
    Controller,
    Post,
    UseInterceptors, UploadedFile, Param, UseGuards, UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('upload')
export class FileUploadController {

    constructor(private fileUploadService: FileUploadService) {
    }

    @UseGuards(JwtAuthGuard)
    @Post('/igcfile/:env/:id')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Param('env') env: string, @Param('id') id: number) {
        return this.fileUploadService.fileUpload(file, env, id);
    }

}
