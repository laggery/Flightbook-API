import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [],
  controllers: [FileUploadController],
  providers: [FileUploadService]
})
export class FileUploadModule {}
