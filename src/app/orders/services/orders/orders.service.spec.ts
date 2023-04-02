import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersValidationService } from '../validations/orders-validation.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PaymentType } from '@common/enums/payment-type.enum';
import { articlesFaker, authResponseDocFaker, ordersFake } from '@common/fakers/data.faker';
import { Role } from '@common/enums/roles.enum';
import { CreateOrderDto } from '@orders/dto/create-order.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersValidationService: OrdersValidationService;
  let prismaServiceMock: DeepMockProxy<PrismaClient>;
  const mockArticle = articlesFaker[0];
  const mockOrders = ordersFake;
  const mockOrder = mockOrders[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersValidationService, useValue: createMock<OrdersValidationService>() },
        PrismaService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<OrdersService>(OrdersService);
    prismaServiceMock = module.get(PrismaService);
    ordersValidationService = module.get<OrdersValidationService>(OrdersValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Client);
      const article = { ...mockArticle, price: 10, stock: 20 };
      const expectedOrder = { ...mockOrder, total: 20, customerId: authResponseDoc.id, detail: [...mockOrder.detail] };
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
        ],
      };
      const detailExpected = {
        total: 20,
        orderDetail: [
          {
            articleName: article.title,
            description: article.description,
            price: article.price,
            quantity: article.stock,
            total: article.price * article.stock,
            articleId: article.id,
          },
        ],
      };

      //@ts-ignore: MockResolvedValueOnce is not resolved
      prismaServiceMock.order.create.mockResolvedValueOnce(expectedOrder);

      jest.spyOn(ordersValidationService, 'validateArticles').mockResolvedValueOnce(detailExpected);

      const order = await service.create(createOrderDto, authResponseDoc);
      expect(order).toEqual(expectedOrder);
    });

    it('should throw an error while crate order', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Client);
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
        ],
      };
      const detailExpected = {
        total: 20,
        orderDetail: [
          {
            articleName: mockArticle.title,
            description: mockArticle.description,
            price: mockArticle.price,
            quantity: mockArticle.stock,
            total: mockArticle.price * mockArticle.stock,
            articleId: mockArticle.id,
          },
        ],
      };

      //@ts-ignore: MockResolvedValueOnce is not resolved
      prismaServiceMock.order.create.mockImplementation((): Promise<never> => {
        return Promise.reject(new InternalServerErrorException());
      });

      jest.spyOn(ordersValidationService, 'validateArticles').mockResolvedValueOnce(detailExpected);

      await expect(service.create(createOrderDto, authResponseDoc)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an error while validate detail order', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Client);
      const createOrderDto: CreateOrderDto = {
        paymentType: PaymentType.CASH,
        orderDetail: [
          {
            productUuid: mockArticle.uuid,
            quantity: 2,
          },
        ],
      };

      //@ts-ignore: MockResolvedValueOnce is not resolved
      prismaServiceMock.order.create.mockResolvedValueOnce(mockOrder);

      jest.spyOn(ordersValidationService, 'validateArticles').mockRejectedValueOnce(new BadRequestException());

      await expect(service.create(createOrderDto, authResponseDoc)).rejects.toThrow(BadRequestException);
    });
  });
});
