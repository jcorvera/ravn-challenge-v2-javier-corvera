import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { FindArticlesService } from './find-articles.service';
import { articlesFaker, queryArticleFaker } from '@app/common/fakers/data.faker';
import { plainToClass } from 'class-transformer';
import { ArticleResponseDoc } from '@app/articles/doc/article.response.doc';
import { NotFoundException } from '@nestjs/common';
import { pagination } from '@app/common/utils';
import { authResponseDocFaker } from '@common/fakers/data.faker';
import { Role } from '@app/common/enums/roles.enum';

describe('FindArticlesService', () => {
  let service: FindArticlesService;
  let prismaServiceMock: DeepMockProxy<PrismaClient>;
  const mockArticles = articlesFaker;
  const mockArticle = mockArticles[0];

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindArticlesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<FindArticlesService>(FindArticlesService);
    prismaServiceMock = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should count all articles', async () => {
      const expectedResult = 10;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.count.mockResolvedValueOnce(expectedResult);
      const count = await service.count();
      expect(count).toEqual(expectedResult);
    });
  });

  describe('findByUuid', () => {
    it('should find an article by uuid', async () => {
      const article = mockArticle;
      const expectedResult = article;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.findFirst.mockResolvedValueOnce(article);
      const foundArticle = await service.findByUuid(article.uuid);
      expect(foundArticle).toEqual(expectedResult);
    });

    it('should null if the article does not exist', async () => {
      const article = mockArticle;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.findFirst.mockResolvedValueOnce(null);
      const foundArticle = await service.findByUuid(article.uuid);
      expect(foundArticle).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should find an article by uuid', async () => {
      const article = mockArticle;
      const expectedResult = plainToClass(ArticleResponseDoc, article);
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.findFirst.mockResolvedValueOnce(article);
      const foundArticle = await service.findOne(article.uuid);
      expect(foundArticle).toEqual(expectedResult);
    });

    it('should throw an error if the article does not exist', async () => {
      const article = mockArticle;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.findFirst.mockResolvedValueOnce(null);
      await expect(service.findOne(article.uuid)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should find all articles', async () => {
      const articles = articlesFaker;
      const queryArticleDto = queryArticleFaker(1, 10);
      const expectedResult = {
        articles,
        ...pagination(articles.length, queryArticleDto.page, queryArticleDto.pageSize),
      };
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.findMany.mockResolvedValueOnce(articles);
      jest.spyOn(service, 'count').mockResolvedValueOnce(articles.length);

      const foundArticles = await service.findAll(queryArticleDto);
      expect(foundArticles).toEqual(expectedResult);
    });

    it('should return an empty array if no articles are found', async () => {
      const queryArticleDto = queryArticleFaker(1, 10);
      const expectedResult = {
        articles: [],
        ...pagination(0, queryArticleDto.page, queryArticleDto.pageSize),
      };
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.article.findMany.mockResolvedValueOnce([]);
      jest.spyOn(service, 'count').mockResolvedValueOnce(0);

      const foundArticles = await service.findAll(queryArticleDto);
      expect(foundArticles).toEqual(expectedResult);
    });
  });

  describe('publicFindOneArticle', () => {
    it('should find an article by uuid', async () => {
      const article = mockArticle;
      const expectedResult = article;
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(article);
      const foundArticle = await service.publicFindOneArticle(article.uuid);
      expect(foundArticle).toEqual(expectedResult);
    });

    it('should throw an error if the article does not exist', async () => {
      const article = mockArticle;
      jest.spyOn(service, 'findOne').mockImplementation((): Promise<ArticleResponseDoc | never> => {
        return Promise.reject(new NotFoundException());
      });

      await expect(service.publicFindOneArticle(article.uuid)).rejects.toThrow(NotFoundException);
    });
  });

  describe('publicFindAllArticles', () => {
    it('should find all articles', async () => {
      const articles = articlesFaker;
      const queryArticleDto = queryArticleFaker(1, 10);
      const expectedResult = {
        articles,
        ...pagination(articles.length, queryArticleDto.page, queryArticleDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundArticles = await service.publicFindAllArticles(queryArticleDto);
      expect(foundArticles).toEqual(expectedResult);
    });

    it('should return an empty array if no articles are found', async () => {
      const queryArticleDto = queryArticleFaker(1, 10);
      const expectedResult = {
        articles: [],
        ...pagination(0, queryArticleDto.page, queryArticleDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundArticles = await service.publicFindAllArticles(queryArticleDto);
      expect(foundArticles).toEqual(expectedResult);
    });
  });

  describe('findOneArticle', () => {
    // -- User is not logged in
    it('should find an article by uuid on public route', async () => {
      const article = mockArticle;
      const expectedResult = article;
      jest.spyOn(service, 'publicFindOneArticle').mockResolvedValueOnce(article);
      const foundArticle = await service.findOneArticle(true, article.uuid);
      expect(foundArticle).toEqual(expectedResult);
    });

    it('should throw an error if the article does not exist on public route', async () => {
      const article = mockArticle;
      jest.spyOn(service, 'publicFindOneArticle').mockImplementation((): Promise<ArticleResponseDoc | never> => {
        return Promise.reject(new NotFoundException());
      });

      await expect(service.findOneArticle(true, article.uuid)).rejects.toThrow(NotFoundException);
    });

    // -- User has a role of client
    it('should find an article by uuid on private route when user is client', async () => {
      const article = mockArticle;
      const authResponseDoc = authResponseDocFaker(Role.Client);
      const expectedResult = plainToClass(ArticleResponseDoc, article);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(article);
      const foundArticle = await service.findOneArticle(false, article.uuid, authResponseDoc);
      expect(foundArticle).toEqual(expectedResult);
    });

    it('should throw an error if the article does not exist when user is client', async () => {
      const article = mockArticle;
      const authResponseDoc = authResponseDocFaker(Role.Client);
      jest.spyOn(service, 'findOne').mockImplementation((): Promise<ArticleResponseDoc | never> => {
        return Promise.reject(new NotFoundException());
      });

      await expect(service.findOneArticle(false, article.uuid, authResponseDoc)).rejects.toThrow(NotFoundException);
    });

    // -- User has a role of Manager
    it('should find an article by uuid on private route when user is manager', async () => {
      const article = mockArticle;
      const authResponseDoc = authResponseDocFaker(Role.Manager);
      const expectedResult = plainToClass(ArticleResponseDoc, article);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(expectedResult);
      const foundArticle = await service.findOneArticle(false, article.uuid, authResponseDoc);
      expect(foundArticle).toEqual(expectedResult);
    });

    it('should throw an error if the article does not exist when user is manager', async () => {
      const article = mockArticle;
      const authResponseDoc = authResponseDocFaker(Role.Manager);
      jest.spyOn(service, 'findOne').mockImplementation((): Promise<ArticleResponseDoc | never> => {
        return Promise.reject(new NotFoundException());
      });

      await expect(service.findOneArticle(false, article.uuid, authResponseDoc)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllArticles', () => {
    //-- User is not logged in
    it('should find all articles on public route', async () => {
      const articles = articlesFaker;
      const queryArticleDto = queryArticleFaker(1, 10);
      const expectedResult = {
        articles,
        ...pagination(articles.length, queryArticleDto.page, queryArticleDto.pageSize),
      };
      jest.spyOn(service, 'publicFindAllArticles').mockResolvedValueOnce(expectedResult);
      const foundArticles = await service.findAllArticles(true, queryArticleDto);
      expect(foundArticles).toEqual(expectedResult);
    });

    it('should return an empty array if no articles are found on public route', async () => {
      const queryArticleDto = queryArticleFaker(1, 10);
      const expectedResult = {
        articles: [],
        ...pagination(0, queryArticleDto.page, queryArticleDto.pageSize),
      };
      jest.spyOn(service, 'publicFindAllArticles').mockResolvedValueOnce(expectedResult);
      const foundArticles = await service.findAllArticles(true, queryArticleDto);
      expect(foundArticles).toEqual(expectedResult);
    });

    //-- User has a role of client
    it('should find all articles on private route when user is client', async () => {
      const articles = articlesFaker;
      const queryArticleDto = queryArticleFaker(1, 10);
      const authResponseDoc = authResponseDocFaker(Role.Client);
      const expectedResult = {
        articles,
        ...pagination(articles.length, queryArticleDto.page, queryArticleDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundArticles = await service.findAllArticles(false, queryArticleDto, authResponseDoc);
      expect(foundArticles).toEqual(expectedResult);
    });

    it('should return an empty array if no articles are found when user is client', async () => {
      const queryArticleDto = queryArticleFaker(1, 10);
      const authResponseDoc = authResponseDocFaker(Role.Client);
      const expectedResult = {
        articles: [],
        ...pagination(0, queryArticleDto.page, queryArticleDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundArticles = await service.findAllArticles(false, queryArticleDto, authResponseDoc);
      expect(foundArticles).toEqual(expectedResult);
    });

    //-- User has a role of manager
    it('should find all articles on private route when user is manager', async () => {
      const articles = articlesFaker;
      const queryArticleDto = queryArticleFaker(1, 10);
      const authResponseDoc = authResponseDocFaker(Role.Manager);
      const expectedResult = {
        articles,
        ...pagination(articles.length, queryArticleDto.page, queryArticleDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundArticles = await service.findAllArticles(false, queryArticleDto, authResponseDoc);
      expect(foundArticles).toEqual(expectedResult);
    });

    it('should return an empty array if no articles are found when user is manager', async () => {
      const queryArticleDto = queryArticleFaker(1, 10);
      const authResponseDoc = authResponseDocFaker(Role.Manager);
      const expectedResult = {
        articles: [],
        ...pagination(0, queryArticleDto.page, queryArticleDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundArticles = await service.findAllArticles(false, queryArticleDto, authResponseDoc);
      expect(foundArticles).toEqual(expectedResult);
    });
  });
});
