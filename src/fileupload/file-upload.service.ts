import { HttpStatus, Injectable } from '@nestjs/common';
import { S3Exception } from './exception/s3-exception';
import { CopyFileDto } from './interface/copyFile-dto';
import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

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
      const params = {
        Bucket: this.bucket,
        Key: `${this.env}/${userId}/${file.originalname}`,
        Body: file.buffer,
        UploadId: userId.toString(),
        ACL: 'private'
      };

      const command = new PutObjectCommand(params);

      await this.s3.send(command);
    } catch (error) {
      throw new S3Exception();
    }
  }

  async copyFile(userId: number, copyFile: CopyFileDto) {
    try {
      const params = {
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
}
