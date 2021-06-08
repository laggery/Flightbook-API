import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3({
  endpoint: process.env.AWS_S3_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class FileUploadService {

  async fileUpload(file, env, userId) {

    try {
      const params = {
        Bucket: 'flightbookbucket',
        Key: `${env}/${userId}/${file.originalname}`,
        Body: file.buffer,
        ACL: 'private',
      };

      s3.putObject(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log(data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'flightbookbucket',
      acl: 'public-read',
      key: function(request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);

  async getFile(env: any, userId: any, filename: any) {
    const params = {
      Bucket: 'flightbookbucket',
      Key: `${env}/${userId}/${filename}`,
    };
    return await s3.getObject(params).promise()
      .then((res) => {
        return res.Body;
      }).catch((err) => {
        return err;
      });
  }
}
