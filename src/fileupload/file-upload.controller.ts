import {
  Controller, Delete,
  Get, HttpCode,
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
    return this.fileUploadService.fileUpload(file, req.user.userId);
  }

  @Get(':filename')
  @UseGuards(JwtAuthGuard)
  async getFile(@Request() req, @Query() query, @Param('filename') filename)  {
    return await this.fileUploadService.getFile(req.user.userId, filename);
  }

  @Delete(':filename')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteFile(@Request() req, @Query() query, @Param('filename') filename)  {
    return await this.fileUploadService.deleteFile(req.user.userId, filename);
  }

}
