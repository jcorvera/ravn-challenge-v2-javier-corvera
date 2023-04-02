import { Test, TestingModule } from '@nestjs/testing';
import { FindOrdersService } from './find-orders.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { authResponseDocFaker, ordersFake, queryOrderFaker } from '@common/fakers/data.faker';
import { pagination } from '@app/common/utils';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@app/common/enums/roles.enum';

describe('FindOrdersService', () => {
  let service: FindOrdersService;
  let prismaServiceMock: DeepMockProxy<PrismaClient>;
  const mockOrders = ordersFake;
  const mockOrder = mockOrders[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindOrdersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<FindOrdersService>(FindOrdersService);
    prismaServiceMock = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should return the number of orders', async () => {
      //@ts-ignore: mockResolvedValue is nor resolved
      prismaServiceMock.order.count.mockResolvedValue(1);
      const result = await service.count();
      expect(result).toBe(1);
    });

    it('should return the incorrect number of orders', async () => {
      //@ts-ignore: mockResolvedValue is nor resolved
      prismaServiceMock.order.count.mockResolvedValue(1);
      const result = await service.count({ id: 1 });
      expect(result).not.toBe(2);
    });
  });

  describe('findOne', () => {
    it('should return the order', async () => {
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.order.findFirst.mockResolvedValueOnce(mockOrder);
      const foundOrder = await service.findOne(mockOrder.uuid);
      expect(foundOrder).toEqual(mockOrder);
    });

    it('should return an error if the order is not found', async () => {
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.order.findFirst.mockResolvedValueOnce(null);
      await expect(service.findOne(mockOrder.uuid)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return the orders', async () => {
      const orders = ordersFake;
      const queryOrderDto = queryOrderFaker(1, 10);
      const expectedResult = {
        orders,
        ...pagination(orders.length, queryOrderDto.page, queryOrderDto.pageSize),
      };
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.order.findMany.mockResolvedValueOnce(orders);
      jest.spyOn(service, 'count').mockResolvedValueOnce(orders.length);

      const foundOrders = await service.findAll(queryOrderDto);
      expect(foundOrders).toEqual(expectedResult);
    });

    it('should return an empty array if no orders are found', async () => {
      const queryOrderDto = queryOrderFaker(1, 10);
      const expectedResult = {
        orders: [],
        ...pagination(0, queryOrderDto.page, queryOrderDto.pageSize),
      };
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.order.findMany.mockResolvedValueOnce([]);
      jest.spyOn(service, 'count').mockResolvedValueOnce(0);

      const foundOrders = await service.findAll(queryOrderDto);
      expect(foundOrders).toEqual(expectedResult);
    });
  });

  describe('findOneOrder', () => {
    //-- When user is client
    it('should return the order when user is client', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Client);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockOrder);
      const foundOrder = await service.findOneOrder(mockOrder.uuid, authResponseDoc);
      expect(foundOrder).toEqual(mockOrder);
    });

    it('should return an error if the order is not found when user us client', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Client);
      jest.spyOn(service, 'findOne').mockImplementation((): Promise<never> => {
        return Promise.reject(new NotFoundException());
      });
      await expect(service.findOneOrder(mockOrder.uuid, authResponseDoc)).rejects.toThrow(NotFoundException);
    });

    //-- When user is manager
    it('should return the order when user is manager', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Manager);
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockOrder);
      const foundOrder = await service.findOneOrder(mockOrder.uuid, authResponseDoc);
      expect(foundOrder).toEqual(mockOrder);
    });

    it('should return an error if the order is not found when user us manager', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Manager);
      jest.spyOn(service, 'findOne').mockImplementation((): Promise<never> => {
        return Promise.reject(new NotFoundException());
      });
      await expect(service.findOneOrder(mockOrder.uuid, authResponseDoc)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllOrders', () => {
    // -- When user is client
    it('should return the orders when user is client', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Client);
      const queryOrderDto = queryOrderFaker(1, 10);
      const expectedResult = {
        orders: mockOrders,
        ...pagination(mockOrders.length, queryOrderDto.page, queryOrderDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundOrders = await service.findAllOrders(queryOrderDto, authResponseDoc);
      expect(foundOrders).toEqual(expectedResult);
    });

    it('should return an empty array if no orders are found when user is client', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Client);
      const queryOrderDto = queryOrderFaker(1, 10);
      const expectedResult = {
        orders: [],
        ...pagination(0, queryOrderDto.page, queryOrderDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundOrders = await service.findAllOrders(queryOrderDto, authResponseDoc);
      expect(foundOrders).toEqual(expectedResult);
    });

    //-- When user is manager
    it('should return the orders when user is manager', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Manager);
      const queryOrderDto = queryOrderFaker(1, 10);
      const expectedResult = {
        orders: mockOrders,
        ...pagination(mockOrders.length, queryOrderDto.page, queryOrderDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundOrders = await service.findAllOrders(queryOrderDto, authResponseDoc);
      expect(foundOrders).toEqual(expectedResult);
    });

    it('should return an empty array if no orders are found when user is manager', async () => {
      const authResponseDoc = authResponseDocFaker(Role.Manager);
      const queryOrderDto = queryOrderFaker(1, 10);
      const expectedResult = {
        orders: [],
        ...pagination(0, queryOrderDto.page, queryOrderDto.pageSize),
      };
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedResult);
      const foundOrders = await service.findAllOrders(queryOrderDto, authResponseDoc);
      expect(foundOrders).toEqual(expectedResult);
    });
  });
});
