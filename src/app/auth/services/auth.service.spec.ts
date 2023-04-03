import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@users/services/users.service';
import { TokensService } from './tokens.service';
import { createMock } from '@golevelup/ts-jest';
import { authResponseDocFaker } from '@common/fakers/data.faker';
import { ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthResponseDoc } from '../doc/auth-response.doc';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let tokensService: TokensService;
  const mockAuthResponseDoc = authResponseDocFaker();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: createMock<UsersService>() },
        { provide: TokensService, useValue: createMock<TokensService>() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    tokensService = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseUserResponse', () => {
    it('should return auth response', () => {
      const auth = {
        id: mockAuthResponseDoc.id,
        uuid: mockAuthResponseDoc.uuid,
        profilePicture: mockAuthResponseDoc.profilePicture,
        firstName: mockAuthResponseDoc.firstName,
        lastName: mockAuthResponseDoc.lastName,
        email: mockAuthResponseDoc.email,
        roles: mockAuthResponseDoc.roles,
      };
      const result = service.parseUserResponse(auth);
      expect(result).toEqual(auth);
    });

    it('should not return reponse properly', () => {
      const auth = mockAuthResponseDoc;
      const result = service.parseUserResponse(auth);
      expect(result).not.toEqual({ ...auth, email: 'notEmail' });
    });
  });

  describe('updateRefreshToken', () => {
    it('should update refresh token', async () => {
      jest.spyOn(tokensService, 'hashData').mockResolvedValue('hash');
      jest.spyOn(usersService, 'updateHashRefreshToken').mockResolvedValue(1);
      const result = await service.updateRefreshToken(1, 'refreshToken');
      expect(result).toBeUndefined();
    });

    it('shoudl throw error', async () => {
      try {
        jest.spyOn(tokensService, 'hashData').mockResolvedValue('hash');
        jest.spyOn(usersService, 'updateHashRefreshToken').mockImplementation((): Promise<number | void> => {
          return Promise.reject(new InternalServerErrorException());
        });
        await service.updateRefreshToken(1, 'refreshToken');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('signUp', () => {
    it('should sign up', async () => {
      const expectedResponse = plainToClass(AuthResponseDoc, mockAuthResponseDoc);
      const signUp = {
        firstName: mockAuthResponseDoc.firstName,
        lastName: mockAuthResponseDoc.lastName,
        email: mockAuthResponseDoc.email,
        phoneNumber: 'phoneNumber',
        password: 'password',
        city: 'city',
        address: 'address',
      };
      jest.spyOn(usersService, 'exists').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(tokensService, 'hashData').mockResolvedValue('hash');
      jest.spyOn(usersService, 'create').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      const result = await service.signUp(signUp);
      expect(result).toEqual(expectedResponse);
    });
    it('should throw conflict exception when user already exists', async () => {
      const signUp = {
        firstName: mockAuthResponseDoc.firstName,
        lastName: mockAuthResponseDoc.lastName,
        email: mockAuthResponseDoc.email,
        phoneNumber: 'phoneNumber',
        password: 'password',
        city: 'city',
        address: 'address',
      };
      jest.spyOn(usersService, 'exists').mockImplementation(() => Promise.resolve(mockAuthResponseDoc));
      jest.spyOn(tokensService, 'hashData').mockResolvedValue('hash');
      jest.spyOn(usersService, 'create').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      try {
        await service.signUp(signUp);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });

    it('should throw internal server error when try to update refreshToken', async () => {
      const signUp = {
        firstName: mockAuthResponseDoc.firstName,
        lastName: mockAuthResponseDoc.lastName,
        email: mockAuthResponseDoc.email,
        phoneNumber: 'phoneNumber',
        password: 'password',
        city: 'city',
        address: 'address',
      };
      jest.spyOn(usersService, 'exists').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(tokensService, 'hashData').mockResolvedValue('hash');
      jest.spyOn(usersService, 'create').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockImplementation(() => {
        return Promise.reject(new InternalServerErrorException());
      });
      try {
        await service.signUp(signUp);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });

    it('should throw internal server error when try to create user', async () => {
      const signUp = {
        firstName: mockAuthResponseDoc.firstName,
        lastName: mockAuthResponseDoc.lastName,
        email: mockAuthResponseDoc.email,
        phoneNumber: 'phoneNumber',
        password: 'password',
        city: 'city',
        address: 'address',
      };
      jest.spyOn(usersService, 'exists').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(tokensService, 'hashData').mockResolvedValue('hash');
      jest.spyOn(usersService, 'create').mockImplementation(() => {
        return Promise.reject(new InternalServerErrorException());
      });
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      try {
        await service.signUp(signUp);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('signIn', () => {
    it('should sign in', async () => {
      const expectedResponse = plainToClass(AuthResponseDoc, mockAuthResponseDoc);
      const user = { ...mockAuthResponseDoc, password: 'password', isActive: true };
      const signIn = {
        email: expectedResponse.email,
        password: 'password',
      };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      const result = await service.signIn(signIn);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw unauthorized exception when user not found', async () => {
      const signIn = {
        email: mockAuthResponseDoc.email,
        password: 'password',
      };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      try {
        await service.signIn(signIn);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw unauthorized exception when password is not correct', async () => {
      const user = { ...mockAuthResponseDoc, password: 'password', isActive: true };
      const signIn = {
        email: mockAuthResponseDoc.email,
        password: 'password',
      };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      try {
        await service.signIn(signIn);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw unauthorized exception when user is not active', async () => {
      const user = { ...mockAuthResponseDoc, password: 'password', isActive: false };
      const signIn = {
        email: mockAuthResponseDoc.email,
        password: 'password',
      };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      try {
        await service.signIn(signIn);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw internal server error when try to update refreshToken', async () => {
      const user = { ...mockAuthResponseDoc, password: 'password', isActive: true };
      const signIn = {
        email: mockAuthResponseDoc.email,
        password: 'password',
      };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockImplementation(() => {
        return Promise.reject(new InternalServerErrorException());
      });
      try {
        await service.signIn(signIn);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('signOut', () => {
    it('should sign out', async () => {
      const userId = mockAuthResponseDoc.id;
      jest.spyOn(usersService, 'updateHashRefreshToken').mockResolvedValueOnce(1);
      const result = await service.signOut(userId);
      expect(result).toBeUndefined();
    });

    it('should throe unauthorized exception when user have been sign up', async () => {
      const userId = mockAuthResponseDoc.id;
      jest.spyOn(usersService, 'updateHashRefreshToken').mockResolvedValueOnce();
      try {
        await service.signOut(userId);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('refreshToken', () => {
    it('should refresh token', async () => {
      const expectedResponse = plainToClass(AuthResponseDoc, mockAuthResponseDoc);
      const user = { ...mockAuthResponseDoc, password: 'password', isActive: true };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      const result = await service.refreshToken(expectedResponse.email, 'refreshToken');
      expect(result).toEqual(expectedResponse);
    });

    it('should throw unauthorized exception when user not found', async () => {
      const expectedResponse = plainToClass(AuthResponseDoc, mockAuthResponseDoc);
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(null));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      try {
        await service.refreshToken(expectedResponse.email, 'refreshToken');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw unauthorized exception when user is not active', async () => {
      const expectedResponse = plainToClass(AuthResponseDoc, mockAuthResponseDoc);
      const user = { ...mockAuthResponseDoc, password: 'password', isActive: false };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      try {
        await service.refreshToken(expectedResponse.email, 'refreshToken');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw unauthorized exception when refresh token is not correct', async () => {
      const expectedResponse = plainToClass(AuthResponseDoc, mockAuthResponseDoc);
      const user = { ...mockAuthResponseDoc, password: 'password', isActive: true };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockResolvedValue();
      try {
        await service.refreshToken(expectedResponse.email, 'refreshToken');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('should throw internal server error when try to update refreshToken', async () => {
      const expectedResponse = plainToClass(AuthResponseDoc, mockAuthResponseDoc);
      const user = { ...mockAuthResponseDoc, password: 'password', isActive: true };
      jest.spyOn(usersService, 'findOne').mockImplementation(() => Promise.resolve(user));
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(tokensService, 'getTokens').mockResolvedValue(mockAuthResponseDoc);
      jest.spyOn(service, 'updateRefreshToken').mockImplementation(() => {
        return Promise.reject(new InternalServerErrorException());
      });
      try {
        await service.refreshToken(expectedResponse.email, 'refreshToken');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
