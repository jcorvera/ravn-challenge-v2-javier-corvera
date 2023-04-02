import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from '../articles/articles.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { CategoriesService } from '../categories/categories.service';
import { FindArticlesService } from './find-articles.service';
import { createMock } from '@golevelup/ts-jest';
import { articlesFaker, createArticleFaker, updateArticleFaker } from '@app/common/fakers/data.faker';
import { plainToClass } from 'class-transformer';
import { ArticleResponseDoc } from '@app/articles/doc/article.response.doc';
import { NotFoundException } from '@nestjs/common';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let categoriesService: CategoriesService;
  let findArticlesService: FindArticlesService;
  let prismaServiceMock: DeepMockProxy<PrismaClient>;
  const mockArticle = articlesFaker[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: CategoriesService, useValue: createMock<CategoriesService>() },
        { provide: FindArticlesService, useValue: createMock<FindArticlesService>() },
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<ArticlesService>(ArticlesService);
    categoriesService = module.get<CategoriesService>(CategoriesService);
    findArticlesService = module.get<FindArticlesService>(FindArticlesService);
    prismaServiceMock = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an article', async () => {
      const article = mockArticle;
      const expectedResult = plainToClass(ArticleResponseDoc, article);
      const createArticleDto = createArticleFaker(article);

      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.create.mockResolvedValueOnce(article);
      const createdArticle = await service.create(createArticleDto);
      expect(createdArticle).toEqual(expectedResult);
    });

    it('should throw an error if the category does not exist', async () => {
      const article = mockArticle;
      const createArticleDtoFaker = createArticleFaker(article);

      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.create.mockResolvedValueOnce(article);
      jest.spyOn(categoriesService, 'findOne').mockResolvedValueOnce(null);
      const createdArticle = service.create(createArticleDtoFaker);

      expect(createdArticle).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const article = mockArticle;
      const expectedResult = plainToClass(ArticleResponseDoc, article);
      const updateArticleDto = updateArticleFaker(article);

      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.update.mockResolvedValueOnce(article);
      const updatedArticle = await service.update(article.uuid, updateArticleDto);
      expect(updatedArticle).toEqual(expectedResult);
    });

    it('should throw an error if the article does not exist', async () => {
      const article = mockArticle;
      const updateArticleDto = updateArticleFaker(article);

      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.update.mockResolvedValueOnce(article);
      jest.spyOn(findArticlesService, 'findByUuid').mockResolvedValueOnce(null);
      const updatedArticle = service.update(article.uuid, updateArticleDto);

      expect(updatedArticle).rejects.toBeInstanceOf(NotFoundException);
    });
  });
  describe('delete', () => {
    it('should delete an article', async () => {
      const article = mockArticle;

      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.update.mockResolvedValueOnce({ deleted: true });
      jest.spyOn(findArticlesService, 'findByUuid').mockResolvedValueOnce(article);

      const deletedArticle = service.remove(article.uuid);

      expect(deletedArticle).resolves.not.toThrow();
    });

    it('should throw an error if the article does not exist', async () => {
      const article = mockArticle;

      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.update.mockResolvedValueOnce({ deleted: true });
      jest.spyOn(findArticlesService, 'findByUuid').mockResolvedValueOnce(null);

      const deletedArticle = service.remove(article.uuid);

      expect(deletedArticle).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
