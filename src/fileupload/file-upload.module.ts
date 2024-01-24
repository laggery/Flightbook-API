import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { ImportModule } from 'src/import/import.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [ImportModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, EmailService]
})
export class FileUploadModule {}
