import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories/categories.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { categoriesFaker } from '@app/common/fakers/data.faker';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaServiceMock: DeepMockProxy<PrismaClient>;
  const mockCategories = categoriesFaker;
  const mockCategory = mockCategories[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaServiceMock = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const mockedCategories = mockCategories;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.category.findMany.mockResolvedValueOnce(mockedCategories);

      const categories = await service.findAll();

      expect(categories).toEqual(mockedCategories);
    });
    it('should return an empty array if there are no categories', async () => {
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.category.findMany.mockResolvedValueOnce([]);

      const categories = await service.findAll();

      expect(categories).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const mockedCategory = mockCategory;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.category.findUnique.mockResolvedValueOnce(mockedCategory);

      const category = await service.findOne(mockedCategory.id);

      expect(category).toEqual(mockedCategory);
    });
    it('should return undefined if the category does not exist', async () => {
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.category.findUnique.mockResolvedValueOnce(null);

      const category = await service.findOne(1);

      expect(category).toBeNull();
    });
  });
});
