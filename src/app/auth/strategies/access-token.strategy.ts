import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthResponseDoc } from '../doc/auth-response.doc';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokenJWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    });
  }

  validate(payload: AuthResponseDoc) {
    return payload;
  }
}
