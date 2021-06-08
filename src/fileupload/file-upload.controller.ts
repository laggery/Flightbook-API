import {
  Controller,
  Get,
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

@Controller('')
export class FileUploadController {

  constructor(private fileUploadService: FileUploadService) {
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/igcfile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File, @Query() query) {
    return this.fileUploadService.fileUpload(file, query.env, req.user.userId);
  }

  @Get(':filename')
  @UseGuards(JwtAuthGuard)
  async getFile(@Request() req, @Query() query, @Param('filename') filename)  {
    let file = await this.fileUploadService.getFile(query.env, req.user.userId, filename);
    return file;
  }

}
