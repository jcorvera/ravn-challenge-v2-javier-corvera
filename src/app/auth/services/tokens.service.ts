import { Injectable } from '@nestjs/common';
import { AuthResponseDoc } from '../doc/auth-response.doc';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  async hashData(data: string): Promise<string> {
    return hash(data, 10);
  }

  async getTokens(user: AuthResponseDoc): Promise<AuthResponseDoc> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...user, type: 'JWT' },
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION, secret: process.env.ACCESS_TOKEN_SECRET },
      ),
      this.jwtService.signAsync(
        { ...user, type: 'JWT' },
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION, secret: process.env.REFRESH_TOKEN_SECRET },
      ),
    ]);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }
}
