import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from '../articles/articles.service';
import { LikesArticlesService } from '../likes/likes-articles.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@app/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { FindArticlesService } from '../articles/find-articles.service';
import { createMock } from '@golevelup/ts-jest';
import { articlesFaker, userArticleLikesFaker } from '@common/fakers/data.faker';
import { NotFoundException } from '@nestjs/common';

describe('LikesArticlesService', () => {
  let service: LikesArticlesService;
  let articlesService: ArticlesService;
  let findArticlesService: FindArticlesService;
  let prismaServiceMock: DeepMockProxy<PrismaClient>;
  const mockArticle = articlesFaker[0];

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesArticlesService,
        PrismaService,
        { provide: FindArticlesService, useValue: createMock<FindArticlesService>() },
        { provide: ArticlesService, useValue: createMock<ArticlesService>() },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<LikesArticlesService>(LikesArticlesService);
    prismaServiceMock = module.get(PrismaService);
    findArticlesService = module.get<FindArticlesService>(FindArticlesService);
    articlesService = module.get<ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('likeArticle', () => {
    it('should like an article', async () => {
      const article = { ...mockArticle, deleted: false };
      const userArticleLikes = userArticleLikesFaker[0];
      // @ts-ignore: mockResolvedValue is not resolved
      findArticlesService.findByUuid.mockResolvedValue(article);
      // @ts-ignore: opeations are not resolved
      prismaServiceMock.userArticleLike.deleteMany.mockResolvedValue({ count: 0 });
      prismaServiceMock.userArticleLike.create.mockResolvedValue(userArticleLikes);
      // @ts-ignore: mockResolvedValue is not resolved
      articlesService.update.mockResolvedValue({ totalLike: 1 });

      const result = await service.likeArticle('uuid', 1);

      expect(result).toEqual({ liked: true, articleUuid: article.uuid });
    });

    it('should dislike an article', async () => {
      const article = { ...mockArticle, deleted: false };
      // @ts-ignore: mockResolvedValue is not resolved
      findArticlesService.findByUuid.mockResolvedValue(article);
      // @ts-ignore: opeations are not resolved
      prismaServiceMock.userArticleLike.deleteMany.mockResolvedValue({ count: 1 });
      // @ts-ignore: mockResolvedValue is not resolved
      articlesService.update.mockResolvedValue({ totalLike: 0 });

      const result = await service.likeArticle('uuid', 1);

      expect(result).toEqual({ liked: false, articleUuid: article.uuid });
    });

    it('should throw an error if article is not found', async () => {
      // @ts-ignore: mockResolvedValue is not resolved
      findArticlesService.findByUuid.mockResolvedValue(null);
      await expect(service.likeArticle('uuid', 1)).rejects.toThrow(NotFoundException);
    });
  });
});
