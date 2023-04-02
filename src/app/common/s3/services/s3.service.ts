require('aws-sdk/lib/maintenance_mode_message').suppress = true;
import { s3config } from '@config/AWS-S3.config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage(dataBuffer: Buffer, filename: string, mimetype: string): Promise<string | never> {
    const s3 = new S3(s3config);
    const fileExtension = filename.split('.');
    const fileName = `${uuid()}.${fileExtension[fileExtension.length - 1]}`;
    try {
      await s3
        .upload({
          ContentType: mimetype,
          Bucket: this.configService.get('S3_BUCKET_NAME'),
          Body: dataBuffer,
          Key: fileName,
        })
        .promise();
      return this.returnLocationImage(fileName);
    } catch {
      throw new InternalServerErrorException(['Internal server error']);
    }
  }

  private returnLocationImage(fileName: string): string {
    return this.configService.get('S3_BUCKET_URL') + '/' + fileName;
  }
}
