import { HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { S3Exception } from './exception/s3-exception';

const s3 = new S3({
  endpoint: process.env.AWS_S3_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


@Injectable()
export class FileUploadService {

  private env = process.env.ENV || "local";

  async fileUpload(file: Express.Multer.File, userId: number) {

    try {
      const params = {
        Bucket: 'flightbookbucket',
        Key: `${this.env}/${userId}/${file.originalname}`,
        Body: file.buffer,
        ACL: 'private',
      };

      const res = await s3.putObject(params).promise();
    } catch (error) {
      throw new S3Exception();
    }
  }

  async getFile(userId: number, filename: string) {
    const params = {
      Bucket: 'flightbookbucket',
      Key: `${this.env}/${userId}/${filename}`,
    };
    return await s3.getObject(params).promise()
      .then((res) => {
        return res.Body;
      }).catch((err) => {
        return err;
      });
  }

  async deleteFile(userId: number, filename: string) {
    const params = {
      Bucket: 'flightbookbucket',
      Key: `${this.env}/${userId}/${filename}`,
    };
    s3.deleteObject(params).promise()
      .then((res) => {
        return HttpStatus.NO_CONTENT;
      }).catch((err) => {
      return err;
    });
  }
}
