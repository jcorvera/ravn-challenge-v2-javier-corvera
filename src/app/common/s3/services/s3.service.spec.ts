import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { S3 } from 'aws-sdk';
import { S3Service } from './s3.service';

jest.mock('aws-sdk', () => {
  const instance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };

  return { S3: jest.fn(() => instance) };
});

jest.mock('uuid', () => {
  return {
    v4: jest.fn().mockReturnValue('f48d49e0-3aa1-4e95-9fb1-4940d201b173'),
  };
});

describe('AwsS3Service', () => {
  let service: S3Service;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
    config = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    let testS3;
    const expectedValue =
      'https://clothes-store-ravn.s3.us-east-2.amazonaws.com/images/f48d49e0-3aa1-4e95-9fb1-4940d201b173.png';
    const params = {};
    const fakeBuffer = Buffer.from('fake buffer', 'utf-8');

    beforeEach(() => {
      testS3 = new S3();
      testS3.promise.mockReturnValueOnce({ bucket: 'TestBucketName' });
    });

    it('Should upload image to S3 and return the url', async () => {
      testS3.upload(params).promise();
      jest.spyOn(config, 'get').mockReturnValue('https://clothes-store-ravn.s3.us-east-2.amazonaws.com/images/');

      const response = await service.uploadImage(fakeBuffer, 'image.png', 'image/png');
      expect(response).toEqual(expectedValue);
    });

    it('Should upload image to s3 but the url is incorrect', async () => {
      testS3.upload(params).promise();
      jest.spyOn(config, 'get').mockReturnValue('https://clothes-store-ravn.s3.us-east-2.amazonaws.com/');

      const response = await service.uploadImage(fakeBuffer, 'image.png', 'image/png');
      expect(response).not.toEqual(expectedValue);
    });

    it('Should throw InternalServerErrorException', async () => {
      try {
        testS3.upload(params).promise.mockImplementation(() => {
          throw new Error();
        });
        jest.spyOn(config, 'get').mockReturnValue('https://clothes-store-ravn.s3.us-east-2.amazonaws.com/images/');

        await service.uploadImage(fakeBuffer, 'image.png', 'image/png');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
