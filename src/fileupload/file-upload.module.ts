import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { ImportModule } from '../import/import.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [ImportModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, EmailService]
})
export class FileUploadModule {}
