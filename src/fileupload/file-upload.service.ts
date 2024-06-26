import { HttpStatus, Injectable } from '@nestjs/common';
import { S3Exception } from './exception/s3-exception';
import { CopyFileDto } from './interface/copyFile-dto';
import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
  CopyObjectCommandInput
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class FileUploadService {

  private bucket = process.env.AWS_BUCKET;
  private env = process.env.ENV || "local";
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      apiVersion: "latest",
      region: "ams3",
      endpoint: process.env.AWS_S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    if (this.env == "local") {
      this.s3.config.forcePathStyle = true;
    }
  }

  async fileUpload(file: Express.Multer.File, userId: number) {

    try {
      const params: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: `${this.env}/${userId}/${file.originalname}`,
        Body: file.buffer,
        ACL: 'private'
      };

      const command = new PutObjectCommand(params);

      await this.s3.send(command);
    } catch (error) {
      throw new S3Exception();
    }
  }

  async getSignedFileUploadUrl(filename: string, userId: number) {

    try {
      const params: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: `${this.env}/${userId}/${filename}`,
        ContentType: 'igc',
        ACL: 'private'
      };

      const command = new PutObjectCommand(params);

      const signedUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 600 // In seconds
      });

      return {url: signedUrl};
    } catch (error) {
      throw new S3Exception();
    }
  }

  async copyFile(userId: number, copyFile: CopyFileDto) {
    try {
      const params: CopyObjectCommandInput = {
        Bucket: this.bucket,
        CopySource: `${this.env}/${userId}/${copyFile.sourceFileName}`,
        Key: `${this.env}/${userId}/${copyFile.destinationFileName}`,
        ACL: 'private'
      };

      const command = new CopyObjectCommand(params);
      await this.s3.send(command);
    } catch (error) {
      throw new S3Exception();
    }
  }

  async getFile(userId: number, filename: string) {

    const streamToBlob = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
      });

    const params = {
      Bucket: this.bucket,
      Key: `${this.env}/${userId}/${filename}`
    };

    const command = new GetObjectCommand(params);

    try {
      const res = await this.s3.send(command);
      return await streamToBlob(res.Body);
    } catch (error) {
      return error;
    }
  }

  async deleteFile(userId: number, filename: string) {
    const params = {
      Bucket: this.bucket,
      Key: `${this.env}/${userId}/${filename}`,
    };

    const command = new DeleteObjectCommand(params);

    try {
      await this.s3.send(command);
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      return error;
    }
  }

  async uploadErrorImportFile(userId: number, file: Express.Multer.File): Promise<String> {
    try {
      const key = `${this.env}/import/${userId}/${uuidv4()}-${file.originalname}`
      const params: PutObjectCommandInput = {
        Bucket: this.bucket,
        Key: key,
        ACL: 'private',
        Body: file.buffer
      };

      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      return key;
    } catch (error) {
      throw new S3Exception();
    }
  }
}
