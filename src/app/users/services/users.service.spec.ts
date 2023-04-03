import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '@app/prisma/prisma.service';
import { signUpDtoFaker, userRolesFaker, usersFaker } from '@common/fakers/data.faker';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserResponseDoc } from '../doc/user.response.doc';

describe('UsersService', () => {
  let service: UsersService;
  let prismaServiceMock: DeepMockProxy<PrismaClient>;
  const mockUsers = usersFaker;
  const mockUser = mockUsers[0];
  const mockUserRoles = userRolesFaker;
  const mockUserRole = mockUserRoles[0];
  const mockSignUpDto = signUpDtoFaker();

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<UsersService>(UsersService);
    prismaServiceMock = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.findUnique.mockResolvedValueOnce(user);
      const foundUser = await service.findOne(user.email);
      expect(foundUser).toEqual(user);
    });

    it('should return null if the user does not exist', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.findUnique.mockResolvedValueOnce(null);
      const foundUser = await service.findOne(user.email);
      expect(foundUser).toBeNull();
    });
  });

  describe('findAllCustomers', () => {
    it('should return an array of users', async () => {
      const users = mockUsers;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.findMany.mockResolvedValueOnce(users);
      const foundUsers = await service.findAllCustomers();
      expect(foundUsers).toEqual(users);
    });

    it('should return an empty array if no users exist', async () => {
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.findMany.mockResolvedValueOnce([]);
      const foundUsers = await service.findAllCustomers();
      expect(foundUsers).toEqual([]);
    });
  });

  describe('exists', () => {
    it('should return true if the user exists', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.findUnique.mockResolvedValueOnce(user);
      const exists = await service.exists(user.email);
      expect(exists).toEqual(user);
    });

    it('should return null if the user does not exist', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.findUnique.mockResolvedValueOnce(null);
      const exists = await service.exists(user.email);
      expect(exists).toBe(null);
    });

    it('should throw an error if query fail', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockRejectedValueOnce
      prismaServiceMock.user.findUnique.mockImplementation((): Promise<UserResponseDoc | never> => {
        return Promise.reject(new InternalServerErrorException());
      });
      await expect(service.exists(user.email)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateHashRefreshToken', () => {
    it('should update the hashRefreshToken of the user', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.update.mockResolvedValueOnce(user);
      const updatedUser = await service.updateHashRefreshToken(user.id, user.hashRefreshToken);
      expect(updatedUser).toBe(undefined);
    });

    it('should delete the hashRefreshToken of the user', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.updateMany.mockResolvedValueOnce({ count: 1 });
      const updatedUser = await service.updateHashRefreshToken(user.id, null);
      expect(updatedUser).toEqual(1);
    });

    it('should throw an error if update query fail', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockRejectedValueOnce
      prismaServiceMock.user.update.mockImplementation((): Promise<UserResponseDoc | never> => {
        return Promise.reject(new InternalServerErrorException());
      });
      await expect(service.updateHashRefreshToken(user.id, user.hashRefreshToken)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw an error if updateMany query fail', async () => {
      const user = mockUser;
      //@ts-ignore: jest-mock-extended doesn't support mockRejectedValueOnce
      prismaServiceMock.user.updateMany.mockImplementation((): Promise<UserResponseDoc | never> => {
        return Promise.reject(new InternalServerErrorException());
      });
      await expect(service.updateHashRefreshToken(user.id, null)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('finOneByRole', () => {
    it('should return an user roles', async () => {
      const userRole = mockUserRole;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.userRoles.findUnique.mockResolvedValueOnce(userRole);
      const foundUserRoles = await service.finOneByRole(userRole.role.id, userRole.userId);
      expect(foundUserRoles).toEqual(userRole.role.name);
    });

    it('should throw UnauthorizedException if role does not exists', async () => {
      const userRole = mockUserRole;
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.userRoles.findUnique.mockResolvedValueOnce(null);
      await expect(service.finOneByRole(1, userRole.userId)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userExpected = mockUser;
      const signUp = {
        firstName: userExpected.firstName,
        lastName: userExpected.lastName,
        email: userExpected.email,
        phoneNumber: userExpected.phoneNumber,
        password: userExpected.password,
        city: userExpected.address.city,
        address: userExpected.address.address,
      };
      //@ts-ignore: jest-mock-extended doesn't support mockRejectedValueOnce
      prismaServiceMock.role.findFirst.mockResolvedValueOnce(mockUserRole.role);
      //@ts-ignore: jest-mock-extended doesn't support mockResolvedValueOnce
      prismaServiceMock.user.create.mockResolvedValueOnce(userExpected);
      const createdUser = await service.create(signUp);
      expect(createdUser).toEqual(userExpected);
    });

    it('should throw an error if create query fail', async () => {
      const signUp = mockSignUpDto;
      //@ts-ignore: jest-mock-extended doesn't support mockRejectedValueOnce
      prismaServiceMock.role.findFirst.mockResolvedValueOnce(mockUserRole.role);
      //@ts-ignore: jest-mock-extended doesn't support mockRejectedValueOnce
      prismaServiceMock.user.create.mockImplementation((): Promise<UserResponseDoc | never> => {
        return Promise.reject(new InternalServerErrorException());
      });
      await expect(service.create(signUp)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
