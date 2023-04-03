import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service';
import { JwtService } from '@nestjs/jwt';
import { createMock } from '@golevelup/ts-jest';
import * as bcrypt from 'bcrypt';
import { authResponseDocFaker } from '@common/fakers/data.faker';

describe('AuthService', () => {
  let service: TokensService;
  let jwtService: JwtService;
  const mockAuthResponseDoc = authResponseDocFaker();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensService, { provide: JwtService, useValue: createMock<JwtService>() }],
    }).compile();

    service = module.get<TokensService>(TokensService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash data', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('myHash'));
    const hash = await service.hashData('myhash');
    expect(hash).toEqual('myHash');
  });

  describe('getTokens', () => {
    it('should return tokens', async () => {
      const auth = mockAuthResponseDoc;
      jest.spyOn(jwtService, 'signAsync').mockImplementation(() => Promise.resolve(auth.accessToken));
      const tokens = await service.getTokens(auth);
      expect(tokens).toEqual(auth);
    });

    it('should throw error', async () => {
      const auth = mockAuthResponseDoc;
      jest.spyOn(jwtService, 'signAsync').mockImplementation(() => Promise.reject(new Error('error')));
      await expect(service.getTokens(auth)).rejects.toThrowError('error');
    });
  });
});
