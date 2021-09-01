import {
  Body,
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
import { CopyFileDto } from './interface/copyFile-dto';

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

  @UseGuards(JwtAuthGuard)
  @Post('copy')
  async copyFile(@Request() req, @Body() copyFile: CopyFileDto) {
    return this.fileUploadService.copyFile(req.user.userId, copyFile);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':filename')
  async getFile(@Request() req, @Param('filename') filename)  {
    return await this.fileUploadService.getFile(req.user.userId, filename);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':filename')
  @HttpCode(204)
  async deleteFile(@Request() req, @Param('filename') filename)  {
    return await this.fileUploadService.deleteFile(req.user.userId, filename);
  }

}
