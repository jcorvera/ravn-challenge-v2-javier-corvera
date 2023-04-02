import { Test, TestingModule } from '@nestjs/testing';
import { OrdersValidationService } from './orders-validation.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PaymentType } from '@common/enums/payment-type.enum';
import { articlesFaker } from '@common/fakers/data.faker';
import { CreateOrderDto } from '@orders/dto/create-order.dto';
import { FindArticlesService } from '@app/articles/services';
import { BadRequestException } from '@nestjs/common';

describe('OrdersValidationService', () => {
  let service: OrdersValidationService;
  let findArticlesService: FindArticlesService;
  const mockArticles = articlesFaker;
  const mockArticle = mockArticles[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersValidationService,
        { provide: FindArticlesService, useValue: createMock<FindArticlesService>() },
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<OrdersValidationService>(OrdersValidationService);
    findArticlesService = module.get<FindArticlesService>(FindArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getArticles', () => {
    it('should return articles', async () => {
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
        ],
      };
      const expectedArticles = [
        {
          ...mockArticle,
        },
      ];
      jest.spyOn(findArticlesService, 'findByUuid').mockResolvedValue(mockArticle);
      const articles = await service.getArticles(createOrderDto);
      expect(articles).toEqual(expectedArticles);
    });

    it('should return empty array', async () => {
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: 'invalid-uuid',
            quantity: 2,
          },
        ],
      };
      jest.spyOn(findArticlesService, 'findByUuid').mockResolvedValue(null);
      const articles = await service.getArticles(createOrderDto);
      expect(articles).toEqual([]);
    });
  });

  describe('calculateTotalPrice', () => {
    it('should return total price', () => {
      const orderDetail = [
        {
          productUuid: mockArticle.uuid,
          quantity: 2,
        },
      ];
      const articles = [
        {
          ...mockArticle,
          price: 20,
        },
      ];
      const expectedTotalPrice = 40;
      const totalPrice = service.calculateTotalPrice(orderDetail, articles);
      expect(totalPrice).toEqual(expectedTotalPrice);
    });

    it('should return unexpected total', () => {
      const orderDetail = [
        {
          productUuid: mockArticle.uuid,
          quantity: 2,
        },
      ];
      const articles = [
        {
          ...mockArticle,
          price: 20,
        },
      ];
      const expectedTotalPrice = 50;
      const totalPrice = service.calculateTotalPrice(orderDetail, articles);
      expect(totalPrice).not.toEqual(expectedTotalPrice);
    });
  });

  describe('mapOrderDetail', () => {
    it('should return order detail', () => {
      const orderDetail = [
        {
          productUuid: mockArticle.uuid,
          quantity: 2,
        },
      ];
      const articles = [
        {
          ...mockArticle,
          price: 20,
        },
      ];
      const expectedOrderDetail = [
        {
          articleName: mockArticle.title,
          description: mockArticle.description,
          price: articles[0].price,
          quantity: orderDetail[0].quantity,
          total: 40,
          articleId: mockArticle.id,
        },
      ];
      const mappedOrderDetail = service.mapOrderDetail(orderDetail, articles);
      expect(mappedOrderDetail).toEqual(expectedOrderDetail);
    });

    it('should return unexpected order detail', () => {
      const orderDetail = [
        {
          productUuid: mockArticle.uuid,
          quantity: 2,
        },
      ];
      const articles = [
        {
          ...mockArticle,
          price: 20,
        },
      ];
      const expectedOrderDetail = [
        {
          articleName: mockArticle.title,
          description: mockArticle.description,
          price: articles[0].price,
          quantity: orderDetail[0].quantity,
          total: 50,
          articleId: mockArticle.id,
        },
      ];
      const mappedOrderDetail = service.mapOrderDetail(orderDetail, articles);
      expect(mappedOrderDetail).not.toEqual(expectedOrderDetail);
    });
  });

  describe('validateQuantity', () => {
    it('should be validate quantity with valid stocl', () => {
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
        ],
      };
      const articles = [
        {
          ...mockArticle,
          stock: 50,
          price: 20,
        },
      ];

      const result = service.validateQuantity(articles, createOrderDto);
      expect(result).toBe(undefined);
    });

    it('should throw error with invalid stock', () => {
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
        ],
      };
      const articles = [
        {
          ...mockArticle,
          stock: 1,
          price: 20,
        },
      ];
      try {
        service.validateQuantity(articles, createOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('validateIfIdsAlreadyExist', () => {
    it('should be validate if ids already exist', () => {
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
        ],
      };
      const articles = [
        {
          ...mockArticle,
          stock: 50,
          price: 20,
        },
      ];
      const result = service.validateIfIdsAlreadyExist(articles, createOrderDto);
      expect(result).toBe(undefined);
    });

    it('should throw error if ids does not exist', () => {
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: 'invalid-uuid',
            quantity: 2,
          },
        ],
      };
      const articles = [
        {
          ...mockArticle,
          stock: 50,
          price: 20,
        },
      ];
      try {
        service.validateIfIdsAlreadyExist(articles, createOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('validateDuplicateIds', () => {
    it('should be validate duplicate ids', () => {
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
          {
            productUuid: 'other-uuid',
            quantity: 2,
          },
        ],
      };
      const result = service.validateDuplicateIds(createOrderDto);
      expect(result).toBe(undefined);
    });

    it('should throw error if duplicate ids', () => {
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
        ],
      };
      try {
        service.validateDuplicateIds(createOrderDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
