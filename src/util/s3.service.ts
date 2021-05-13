import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3({
  endpoint: process.env.AWS_S3_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

@Injectable()
export class S3Service {


  async fileupload(@Req() req) {
    try {
      const params = {
        Bucket: "flightbookbucket",
        Key: req.body.file,
        Body: req.body.file,
        ACL: "private",
        Metadata: {
          "x-amz-meta-my-key": "your-value"
        }
      };

      s3.putObject(params, function(err, data) {
        if (err) {console.log(err, err.stack);}
        else     {console.log(data);}
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
}