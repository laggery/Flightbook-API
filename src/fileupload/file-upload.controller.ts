import {
  Body,
  Controller, Delete,
  Get, HttpCode,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CopyFileDto } from './interface/copyFile-dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';

@Controller('file')
@ApiTags('File Upload')
@ApiBearerAuth('jwt')
export class FileUploadController {

  constructor(private fileUploadService: FileUploadService) {
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
  @Post('copy')
  async copyFile(@Request() req, @Body() copyFile: CopyFileDto) {
    return this.fileUploadService.copyFile(req.user.userId, copyFile);
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({name: 'filename', required: true, schema: { oneOf: [{type: 'string'}]}})
  @Get(':filename')
  async getFile(@Request() req, @Param('filename') filename) {
    return await this.fileUploadService.getFile(req.user.userId, filename);
  }

  @UseGuards(JwtAuthGuard)
  @ApiParam({name: 'filename', required: true, schema: { oneOf: [{type: 'string'}]}})
  @Delete(':filename')
  @HttpCode(204)
  async deleteFile(@Request() req, @Param('filename') filename) {
    return await this.fileUploadService.deleteFile(req.user.userId, filename);
  }

}
