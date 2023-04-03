import { Test, TestingModule } from '@nestjs/testing';
import { ImagesArticlesService } from '../images/images-articles.service';
import { FindArticlesService } from '../articles/find-articles.service';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { S3Service } from '@common/s3/services/s3.service';
import { createMock } from '@golevelup/ts-jest';
import { PrismaService } from '@app/prisma/prisma.service';
import { articlesFaker, imagesFaker, mockFiles } from '@common/fakers/data.faker';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('ImagesArticlesService', () => {
  let service: ImagesArticlesService;
  let findArticlesService: FindArticlesService;
  let s3Service: S3Service;
  const mockArticle = articlesFaker[0];
  const mockImgs = imagesFaker;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesArticlesService,
        PrismaService,
        { provide: FindArticlesService, useValue: createMock<FindArticlesService>() },
        { provide: S3Service, useValue: createMock<S3Service>() },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<ImagesArticlesService>(ImagesArticlesService);
    findArticlesService = module.get<FindArticlesService>(FindArticlesService);
    s3Service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SaveImage', () => {
    it('should save an image', async () => {
      const articleId = 1;
      const images = [{ src: 'http://localhost:3000/image.jpg', articleId }];
      const saveImage = jest.spyOn(service, 'saveImages').mockImplementation(async () => images);

      const result = await service.saveImages(articleId, images);

      expect(saveImage).toBeCalledWith(articleId, images);
      expect(result).toEqual(images);
    });
  });

  describe('uploadImages', () => {
    it('should upload images', async () => {
      const articleId = mockArticle.uuid;
      const expectdResult = {
        articleUuid: mockArticle.uuid,
        images: mockImgs.map((img) => ({ src: img.src, id: img.id })),
      };

      jest.spyOn(findArticlesService, 'findByUuid').mockImplementation(async () => mockArticle);
      jest.spyOn(s3Service, 'uploadImage').mockImplementation(async () => mockFiles[0].filename);
      jest.spyOn(service, 'saveImages').mockImplementation(async () => mockImgs);

      const result = await service.uploadImages(articleId, mockFiles);
      expect(result).toEqual(expectdResult);
    });

    it('should throw an error if upload image failed on upploadImage', async () => {
      const articleId = mockArticle.uuid;
      jest.spyOn(findArticlesService, 'findByUuid').mockImplementation(async () => mockArticle);
      jest.spyOn(s3Service, 'uploadImage').mockImplementation((): Promise<never> => {
        return Promise.reject(new InternalServerErrorException());
      });
      await expect(service.uploadImages(articleId, mockFiles)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an error if upload image failed on saveImages', async () => {
      const articleId = mockArticle.uuid;
      jest.spyOn(findArticlesService, 'findByUuid').mockImplementation(async () => mockArticle);
      jest.spyOn(s3Service, 'uploadImage').mockImplementation(async () => mockFiles[0].filename);
      jest.spyOn(service, 'saveImages').mockImplementation((): Promise<never> => {
        return Promise.reject(new InternalServerErrorException());
      });
      await expect(service.uploadImages(articleId, mockFiles)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an error if article not found', async () => {
      const articleId = mockArticle.uuid;
      jest.spyOn(findArticlesService, 'findByUuid').mockImplementation(async () => null);
      await expect(service.uploadImages(articleId, mockFiles)).rejects.toThrow(NotFoundException);
    });
  });
});
